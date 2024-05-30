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
import { validateCrsUri } from "../components/params";

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
        for (const query of dQuery) {
          /**
           * @description Disallow specific paths for a collection if it does not have them
           * @example a matched collection does not support a location query. Check if path includes that keyword. If true, error 400
           */
          if (!matchedCollection.data_queries[query]) {
            ctx.res
              .status(404)
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

      if (_oasListedParams.query.crs) {
        if (
          !URL.canParse(_oasListedParams.query.crs) || //If the received crs param is not an url, =>400 or not in the global list of coordinate reference systems
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
      /**
       * @description Validate Well Known Text (wkt) strings. Only for @param coords
       *
       */
      if (_oasListedParams.query.coords) {
        // Convert the coords param to uppercase
        _oasListedParams.query.coords =
          _oasListedParams.query.coords.toUpperCase();

        /**
         * @returns 400 if @param crs is undefined
         */
        if (!_oasListedParams.query.crs) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords",
                "the crs param must be defined before using this endpoint"
              )
            );
          return;
        }
        /**
         * @type GeometryTypes
         * @description Define what geometryTypes can be inserted into the allowedGeometryTypes
         */
        type GeometryTypes =
          | "POINT"
          | "MULTIPOINT"
          | "LINESTRING"
          | "LINESTRINGM"
          | "LINESTRINGZM"
          | "POLYGON"
          | "LINESTRINGZ";

        let allowedGeometryTypes: GeometryTypes[];

        /**
         * @description Works on the premise that the pathname ends one of the above @interface GeometryTypes
         * If it ends with one, insert the geometryTypes allowed for the path
         */
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
         * @description Trigger 400 error if the path has provided the @param coords but has no allowed coords types
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
        /**
         * Split the wkt string upto opening bracket and access the string upto the bracket.
         * If the resulting string is not in instantiated @interface allowedGeometryTypes. Error 400
         */
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

        /**
         * @description validate that if @coords is not defined at the same time as @param datetime & @param z for LINESTRINGZM
         */
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

        /**
         * @description validate that if @coords is not defined at the same time as @param z for LINESTRINGZ
         */
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
        /**
         * @description validate that if @coords is not defined at the same time as @param datetime for LINESTRINGM
         */
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

        /**
         * @description Receive the @param coords and derive associated elements. Applied on all geometries. Returns null for all fields that do not have associated axis
         * @returns the following for the param
         *          @zmin (minimum height for the coords)
         *          @zmax (maximum height for the coords)
         *          @mmin (minimum timestamp for the coords)
         *          @mmax (minimum timestamp for the coords)
         *          @coords2d (2D wkt for the parameter)
         */
        try {
          const isValidWkt: any = await sequelize.query(
            `With res as (Select (ST_DumpPoints(
              ST_Transform(ST_GeometryFromText('${
                _oasListedParams.query.coords as string
              }',${
              (
                await validateCrsUri(_oasListedParams.query.crs)
              ).srid
            }),3857)
              )).geom as newgeom)
              Select  max(ST_Z(newgeom)) as zmax,
                      min(ST_Z(newgeom)) as zmin, 
                      to_timestamp(max(ST_M(newgeom))) as mmax,
                      to_timestamp(min(ST_M(newgeom))) as mmin, 
                      ST_AsText(ST_Force2D(ST_Transform(ST_GeometryFromText('${
                        _oasListedParams.query.coords
                      }',${
              (
                await validateCrsUri(_oasListedParams.query.crs)
              ).srid
            }),3857))) as newcoords
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
          _oasListedParams.query.parsedcoords = {
            zmin: isValidWkt[0].zmin,
            zmax: isValidWkt[0].zmax,
            mmin: isValidWkt[0].mmin,
            mmax: isValidWkt[0].mmax,
            coords2d: isValidWkt[0].newcoords,
          };
        } catch (err) {
          /**
           * If @err message includes "geometry", this implies invalid geometry thus user error
           */
          if (
            //err.message.includes("geometry") ||
            (err.message as string).toLowerCase().includes("invalid")
            //||err.mmesage.includes("coordinate")
          ) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(
                  ctx,
                  "coords",
                  err.message as string
                )
              );
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

      /**
       * @description Do the same for @param bboxcrs
       */
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

      /**
       * @description Force user to provide@param bbox. This is because the bbox schema in edrSchemas does not say required:true
       */
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

      /**
       * @description Validate datetime
       */
      if (_oasListedParams.query.datetime) {
        /**
         * @description  Instantiate the ajv package used to validate OAS3.x.x formats
         */
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
          //i.e: timestamp/timestamp | ../timestamp | timestamp/..
          if (_oasListedParams.query.datetime.startsWith("../")) {
            result.end = _oasListedParams.query.datetime.split("/")[1]; //../timestamp
          } else if (_oasListedParams.query.datetime.endsWith("/..")) {
            result.start = _oasListedParams.query.datetime.split("/")[0]; //timestamp/..
          } else {
            result.start = _oasListedParams.query.datetime.split("/")[0]; //timestamp/timestamp
            result.end = _oasListedParams.query.datetime.split("/")[1];
          }
        } else {
          result.one = _oasListedParams.query.datetime.replace(" ", "+"); //timestamp
        }
        /**
         * @description validate all entries in the result array to ensure that they are datetimes
         */
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
        _oasListedParams.query.parseddatetime = result;
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
            //Generate intervals using the param provided
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
          newZ.one = zparam;
        }

        _oasListedParams.query.parsedz = newZ as NewZ;
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
