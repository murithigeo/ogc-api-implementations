import {
  ExegesisPlugin,
  ExegesisPluginInstance,
  ExegesisPluginContext,
  HttpIncomingMessage,
} from "exegesis-express";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import sequelize from "../../../dbconnection";
import { QueryTypes } from "sequelize";
import * as crsDetails from "../../components/crsdetails";
import makeQueryValidationError from "../../components/makeValidationError";
import return500InternalServerErr from "../../components/makeInternalServerError";
import * as edrIndex from "../index";

type GeometryTypes =
  | "POINT"
  | "MULTIPOINT"
  | "LINESTRING"
  | "LINESTRINGM"
  | "LINESTRINGZM"
  | "POLYGON"
  | "LINESTRINGZ";

/**
 * @function makeExegesisPlugin create a new plugin to handle preController, postSecurity validation.
 * @description better to handle all validations in one file
 * @param data
 * @param nonDocumentedParamsToIgnore
 * @returns
 */

function makeExegesisPlugin(
  data: { apiDoc: any },
  nonDocumentedParamsToIgnore: string[]
): ExegesisPluginInstance {
  return {
    preRouting: ({ req, res }: { req: HttpIncomingMessage; res: any }) => {},
    postSecurity: async (ctx: ExegesisPluginContext) => {
      //Construct url
      const _url = new URL(ctx.api.serverObject.url + ctx.req.url);
      //Initialize parameters
      const _oasListedParams = await ctx.getParams();

      //Force definition of bbox on certain paths.

      if (
        _oasListedParams.path.collectionId === "" ||
        _oasListedParams.path.instanceId === ""
      ) {
        ctx.res
          .status(400)
          .json(
            ctx.makeValidationError(
              "collectionId or instanceId cannot be an empty string",
              {
                in: "path",
                name: _oasListedParams.path.instanceId
                  ? "instanceId"
                  : "collectionId",
                docPath: ctx.api.pathItemPtr,
              }
            )
          )
          .end();
        return;
      }

      const allowedQueryTypes: string[] = [
        "instances",
        "locations",
        "items",
        "radius",
        "position",
        "area",
        "trajectory",
        "corridor",
        "cube",
      ];
      //Validate CollectionIds
      if (_oasListedParams.path.collectionId) {
        if (
          !edrIndex.collectionsMetadata
            .map((collection) => collection.id)
            .includes(_oasListedParams.path.collectionId)
        ) {
          ctx.res
            .status(404)
            .json({
              message: `Collection: ${_oasListedParams.path.collectionId} does not exist`,
            })
            .end();
        }

        const matchedCollection = edrIndex.collectionsMetadata.find(
          (collection) => collection.id === _oasListedParams.path.collectionId
        );
        const dQuery = allowedQueryTypes.find(
          (queryType) =>
            _url.pathname.endsWith(queryType) ||
            _url.pathname.includes(queryType)
        );
        if (!matchedCollection.data_queries[dQuery]) {
          ctx.res
            .status(400)
            .json(
              ctx.makeValidationError(
                `${matchedCollection.id} does not server via this endpoint`,
                { in: "path", name: dQuery, docPath: ctx.api.pathItemPtr }
              )
            );
          return;
        }

        if (
          _url.pathname.endsWith("corridor") &&
          !matchedCollection.data_queries.corridor.height_units.includes(
            _oasListedParams.query["height-units"]
          )
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "height-units",
                "The unit provided is not currently supported by this collection"
              )
            );
        }

        if (
          _url.pathname.endsWith("corridor") &&
          !matchedCollection.data_queries.corridor.width_units.includes(
            _oasListedParams.query["width-units"]
          )
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "width-units",
                "The unit provided is not currently supported by this collection"
              )
            );
        }
        if (_url.pathname.endsWith("radius")) {
          if (
            !matchedCollection.data_queries.radius.within_units.includes(
              _oasListedParams.query["within-units"]
            )
          ) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(
                  ctx,
                  "within-units",
                  "Units provided not supported by this endpoint"
                )
              )
              .end();
            return;
          }
        }
        if (_oasListedParams.query["parameter-name"]) {
          const unlistedParamNames = (
            _oasListedParams.query["parameter-name"] as string
          )
            .split(",")
            .filter(
              (pName) => !matchedCollection.parameter_names.includes(pName)
            );
          if (unlistedParamNames.length > 0) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(
                  ctx,
                  "param-name",
                  "The following query params are not listed in the collections metadata thus are INVALID: " +
                    unlistedParamNames.join(",")
                )
              )
              .end();
            return;
          }
        }
      }

      //Validate units

      //Access all params present on req.url
      const _allQueryParams = Array.from(
        new URLSearchParams(_url.search).keys()
      );

      //undocumented (not defined in the oas doc)
      const allowedQueryParams: string[] = [];

      //Push queryParamsToIgnore
      if (nonDocumentedParamsToIgnore.length > 0) {
        allowedQueryParams.push(...nonDocumentedParamsToIgnore);
      }

      //Push documented params to allowedQueryParams array
      if (Object.keys(_oasListedParams.query).length > 0) {
        allowedQueryParams.push(...Object.keys(_oasListedParams.query));
      }

      //Filter the _allQueryParams using the _oasListedParams.query keys and return an array with the undocumented queryParams detected
      const unexpectedParams = _allQueryParams.filter(
        (param) => !allowedQueryParams.includes(param)
      );

      //return 400 if undocumented and non-ignored params present

      if (unexpectedParams.length > 0) {
        ctx.res
          .status(400)
          .json(await makeQueryValidationError(ctx, unexpectedParams.join("|")))
          .end();
        return;
      }

      //Validate wkt strings
      if (_oasListedParams.query.coords) {
        //Convert the coords string to uppercase for better handling
        _oasListedParams.query.coords =
          _oasListedParams.query.coords.toUpperCase();

        let allowedGeometryTypes: GeometryTypes[];
        switch (
          allowedQueryTypes.find((queryType) =>
            _url.pathname.endsWith(queryType)
          )
        ) {
          case "radius":
            allowedGeometryTypes = ["POINT", "MULTIPOINT"];
            break;
          case "cube":
            //Do Nothing. No coords param
            //console.log();
            break;
          case "corridor":
            allowedGeometryTypes = [
              "LINESTRING",
              "LINESTRINGM",
              "LINESTRINGZ",
              "LINESTRINGZM",
            ];
            break;
          case "items":
            //Do Nothing since it does not use coords param
            break;
          case "locations":
            //Do Nothing
            break;
          case "position":
            allowedGeometryTypes = ["POINT", "MULTIPOINT"];
            break;
          case "area":
            allowedGeometryTypes = ["POLYGON"];
            break;
          case "trajectory":
            allowedGeometryTypes = [
              "LINESTRING",
              "LINESTRINGM",
              "LINESTRINGZ",
              "LINESTRINGZM",
            ];
            break;
        }

        /**
         * @description Trigger 400 error if the provided geometry is not in endpoint' allowed GeometryType
         */
        if (allowedGeometryTypes.length < 1) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords",
                "Ensure that the coords is valid i.e. Doesn't have space like LINESTRING Z etc"
              )
            );
        }
        if (
          !allowedGeometryTypes.includes(
            _oasListedParams.query.coords.split("(")[0].trim()
          )
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords",
                `Endpoint only supports: ${allowedGeometryTypes.join(
                  "|"
                )} GeometryTypes`
              )
            )
            .end();
          return;
        }

        if (
          (_oasListedParams.query.coords as string).startsWith(
            "LINESTRINGZM"
          ) &&
          (_oasListedParams.query.z || _oasListedParams.query.datetime)
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords|" + _oasListedParams.query.z ? "z" : "datetime",
                "A LINESTRINGZM wkt & datetime | z cannot be defined at the same time"
              )
            );
          return;
        }
        if (
          (_oasListedParams.query.coords as string).startsWith("LINESTRINGZ") &&
          _oasListedParams.query.z
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords|z",
                "A LINESTRINGZ wkt & z cannot be defined at the same time"
              )
            );
        }

        if (
          (_oasListedParams.query.coords as string).startsWith("LINESTRINGM") &&
          _oasListedParams.query.datetime
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords|datime",
                "A LINESTRINGM wkt & datetime cannot be defined at the same time"
              )
            );
        }

        try {
          const isValidWkt: any = await sequelize.query(
            `select ST_IsValidReason('${_oasListedParams.query.coords}'::geometry) as isvalid`,
            {
              type: QueryTypes.SELECT,
            }
          );
          if (isValidWkt && isValidWkt[0].isvalid !== "Valid Geometry") {
            ctx.res
              .status(400)
              .json(
                makeQueryValidationError(
                  ctx,
                  "coords",
                  "Invalid Geometry: " + isValidWkt[0].isvalid
                )
              )
              .end();
            return;
          }
        } catch (err) {
          /**
           * If @err message includes "geometry", this implies invalid geometry
           */
          if (err.message.includes("geometry")) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(
                  ctx,
                  "coords",
                  err.message as string
                )
              )
              .end();
            return;
          } else {
            ctx.res
              .status(500)
              .json(await return500InternalServerErr(ctx))
              .end();
            return;
          }
        }
      }

      if (_oasListedParams.query.crs) {
        if (
          !URL.canParse(_oasListedParams.query.crs) ||
          !crsDetails._allsupportedcrsUris.includes(_oasListedParams.query.crs)
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "crs",
                !URL.canParse(_oasListedParams.query.crs)
                  ? "CRS must be in the uri syntax http://www.opengis.net/def/crs/{authority}/{version}/{code} to reduce complexity"
                  : "The CRS requested is not currently supported by this server"
              )
            );
          return;
        }
      }

      if (_oasListedParams.query["bbox-crs"]) {
        if (
          !URL.canParse(_oasListedParams.query["bbox.crs"]) ||
          !crsDetails._allsupportedcrsUris.includes(
            _oasListedParams.query["bbox-crs"]
          )
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "bbox-crs",
                !URL.canParse(_oasListedParams.query["bbox-crs"])
                  ? "CRS must be in the uri syntax http://www.opengis.net/def/crs/{authority}/{version}/{code} to reduce complexity"
                  : "The CRS requested is not currently supported by this server"
              )
            );
          return;
        }
      }

      if (_url.pathname.endsWith("cube")) {
        if (!_oasListedParams.query.bbox) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "bbox",
                "bbox must be provided"
              )
            )
            .end();
          return;
        }
      }

      //Validate datetime
      if (_oasListedParams.query.datetime) {
        const ajv = new Ajv();
        addFormats(ajv);
        const dateTimeValidator = ajv.compile({
          type: "string",
          format: "date-time",
        });
        let result: {
          start: string | undefined;
          end: string | undefined;
          one: string | undefined;
        } = {
          start: undefined,
          end: undefined,
          one: undefined,
        };
        if (_oasListedParams.query.datetime.includes("/")) {
          if (_oasListedParams.query.datetime.startsWith("../")) {
            result.end = _oasListedParams.query.datetime.split("/")[1];
          } else if (_oasListedParams.query.datetime.endsWith("/..")) {
            result.start = _oasListedParams.query.datetime.split("/")[0];
          } else {
            result.start = _oasListedParams.query.datetime.split("/")[0];
            result.end = _oasListedParams.query.datetime.split("/")[1];
          }
        } else {
          result.one = _oasListedParams.query.datetime.replace(" ", "+");
        }
        for (const key in result) {
          if (result[key]) {
            result[key] = result[key].replace(" ", "+");
            if (!dateTimeValidator(result[key])) {
              throw new Error(
                "strings in this parameter must conform to the rfc 3339 spec"
              );
            }
          }
        }
        _oasListedParams.query.datetime = result;
      }
    },
  };
  //Validate parameter-names
}

/**
 * @description Validate coords queryParam. Note that it does not validate that the provided wkt is valid in accompanying crs
 * @returns exegesisPlugin
 */
function validateInitialRequests(
  nonDocumentedParamsToIgnore: string[]
): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-ogcedrwktvalidator_postgis",
    },
    makeExegesisPlugin: (data: { apiDoc: any }) =>
      makeExegesisPlugin(data, nonDocumentedParamsToIgnore),
  };
}

export default validateInitialRequests;
