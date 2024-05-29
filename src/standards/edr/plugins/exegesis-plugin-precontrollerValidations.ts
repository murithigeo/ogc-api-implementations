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
      //instantiate new ajv instance
      const ajv = new Ajv();
      addFormats(ajv);
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

        const dQuery = allowedQueryTypes.filter((queryType) =>
          //_url.pathname.endsWith(queryType) ||
          _url.pathname.includes(queryType)
        );
        console.log("dquery", dQuery);
        for (const query of dQuery) {
          if (!matchedCollection.data_queries[query]) {
            ctx.res
              .status(400)
              .json(
                ctx.makeValidationError(
                  `${matchedCollection.id} does not server via this endpoint`,
                  { in: "path", name: query, docPath: ctx.api.pathItemPtr }
                )
              );
            return;
          }
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
        }

        /**
         * @description Trigger 400 error if the provided geometry is not in endpoint' allowed GeometryType
         */
        if (!allowedGeometryTypes) {
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
            `With res as (Select (ST_DumpPoints(
              ST_GeometryFromText('${_oasListedParams.query.coords as string}')
              )).geom as newgeom)
              Select  max(ST_Z(newgeom)) as zmax,
                      min(ST_Z(newgeom)) as zmin, 
                      to_timestamp(max(ST_M(newgeom))) as mmax,
                      to_timestamp(min(ST_M(newgeom))) as mmin, 
                      ST_AsText(ST_Force2D(ST_GeometryFromText('${
                        _oasListedParams.query.coords
                      }'))) as newcoords 
                      from res;`,
            {
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          if (!isValidWkt) {
            ctx.res
              .status(400)
              .json(
                makeQueryValidationError(
                  ctx,
                  "coords",
                  "Invalid Geometry: " //+ isValidWkt[0].isvalid
                )
              )
              .end();
            return;
          }
          _oasListedParams.query.coords = {
            zmin: isValidWkt[0].zmin,
            zmax: isValidWkt[0].zmax,
            mmin: isValidWkt[0].mmin,
            mmax: isValidWkt[0].mmax,
            coords2d: isValidWkt[0].newcoords,
          };
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
              ctx.res
                .status(400)
                .json(
                  await makeQueryValidationError(
                    ctx,
                    "datetime",
                    "elements of interval/datetime must be rfc 3339 compliant"
                  )
                );
            }
          }
        }
        _oasListedParams.query.datetime = result;
      }

      //Validate and parse z
      if (_oasListedParams.query.z) {
        const errorValidationMessge =
          "Check that the query matches the interval schema";
        interface NewZ {
          max: undefined | number;
          min: undefined | number;
          in: undefined | number[];
          one: undefined | number;
          //incrementBy: undefined | number;
          //intervalNumber: undefined | number;
        }
        let newZ = {
          max: undefined,
          min: undefined,
          in: undefined,
          one: undefined,
          //incrementBy: undefined,
          //intervalNumber: undefined,
        };
        const zparam = (_oasListedParams.query.z as string).toUpperCase();
        if (zparam.startsWith("R")) {
          //input R10/20/30
          //After removing R & splitting [10,20,30]
          const parsedZ = zparam
            .substring(1)
            .split("/")
            .filter((z) => z !== "");
          if (parsedZ.length < 3) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              );
            return;
          }
          if (parsedZ.length > 3) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              )
              .end();
          }
          for (const val of parsedZ) {
            if (isNaN(Number(val))) {
              ctx.res.status(400).json(
                ctx.makeValidationError("Invalid datatype", {
                  in: "query",
                  name: "z",
                  docPath: ctx.api.pathItemPtr,
                })
              );
            }
          }
          newZ.in = [];
          for (
            let i = parseInt(parsedZ[1], 10);
            i <=
            parseInt(parsedZ[1], 10) +
              parseInt(parsedZ[0], 10) * parseInt(parsedZ[2]);
            i += parseInt(parsedZ[2], 10)
          ) {
            newZ.in.push(i);
          }
        } else if (zparam.includes("/")) {
          const parsedZ = zparam.split("/").filter((z) => z !== "");
          if (parsedZ.length < 2) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              );
          }
          if (parsedZ.length > 2) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(ctx, "z", errorValidationMessge)
              );
          }
          for (const val of parsedZ) {
            if (isNaN(Number(val))) {
              ctx.res.status(400).json(
                ctx.makeValidationError("Invalid datatype", {
                  in: "query",
                  name: "z",
                  docPath: ctx.api.pathItemPtr,
                })
              );
            }
          }
          newZ.min = parsedZ[0];
          newZ.max = parsedZ[1];
        } else if (zparam.includes(",")) {
          //console.log(__filename, 596);

          const parsedZ = zparam.split(",").filter((z) => z !== "");
          for (const val of parsedZ) {
            if (isNaN(Number(val))) {
              ctx.res.status(400).json(
                ctx.makeValidationError("Invalid datatype", {
                  in: "query",
                  name: "z",
                  docPath: ctx.api.pathItemPtr,
                })
              );
            }
          }
          newZ.in = parsedZ;
        } else {
          //console.log(__filename, 601);

          newZ.one = zparam;
        }
        /*
        const numValidator = ajv.compile({ type: "number", format: "double" });
        for (const key in newZ) {
          if (newZ[key]) {
            console.log(newZ[key]);
            if (Array.isArray(newZ[key])) {
              for (const i of newZ[key]) {
                if (isNaN(Number(i))) {
                  console.log(611);
                  ctx.res.status(400).json(
                    ctx.makeValidationError(
                      "One or more params is not a __number/compliant with schema",
                      {
                        in: "query",
                        name: "z",
                        docPath: ctx.api.pathItemPtr,
                      }
                    )
                  );
                  return;
                }
              }
            } else {
              if (isNaN(Number(newZ[key]))) {
                console.log(627);
                ctx.res
                  .status(400)
                  .json(
                    await makeQueryValidationError(
                      ctx,
                      "z",
                      "One or more params is not a number/compliant with schema"
                    )
                  );
                return;
              }
            }
            if (Array.isArray(newZ[key])) {
              newZ[key] = (newZ[key] as []).map((i) => parseInt(i, 10));
            } else {
              newZ[key] = parseInt(newZ[key], 10);
            }
          }
        }
        */
        _oasListedParams.query.z = newZ as NewZ;
        //ctx.res.status(400).json({ message: "Z param catch" });
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
