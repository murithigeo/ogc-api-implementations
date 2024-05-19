import {
  ExegesisPlugin,
  ExegesisContext,
  ExegesisPluginInstance,
  ExegesisPluginContext,
} from "exegesis-express";
import sequelize from "../../../dbconnection";
import { DatabaseError, QueryTypes, Sequelize } from "sequelize";
import { error } from "console";
import makeQueryValidationError from "../../components/makeValidationError";
import return500InternalServerErr from "../../components/makeInternalServerError";

type GeometryTypes =
  | "POINT"
  | "MULTIPOINT"
  | "LINESTRING"
  | "LINESTRINGM"
  | "LINESTRINGZM"
  | "POLYGON"
  | "LINESTRINGZ";
/**
 * @function checkIfGeometryType
 */
async function checkCoordsString_allowedGeometry(
  coords: string,
  allowedGeometryTypes: GeometryTypes[]
) {
  return allowedGeometryTypes.some((type) => coords.startsWith(type));
}

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
    postSecurity: async (ctx: ExegesisPluginContext) => {
      //Construct url
      const _url = new URL(ctx.api.serverObject.url + ctx.req.url);
      //Initialize parameters
      const _oasListedParams = await ctx.getParams();

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

      /**
       * @param "parameter-name" validation
       */

      //Rules
      /**
       * @coords Radius
       * @supports 3D
       * @geometry Point(x,y)|MultiPoint((x,y),(x1,y2),(xn,yn))
       */
      /**
       * @description Full maturity of this validation will only be reached when postgis 3.5 is released
       * @function hasZ returns boolean based on presence of Z axis
       * @function hasM returns boolean based on presence of M axis
       *
       */

      //TrajectoryCoords

      /**
       * @property coords
       * @geometries Point
       * @Error 400 if:
       *
       */

      //Validate wkt strings
      if (_oasListedParams.query.coords) {
        //Convert the coords string to uppercase for better handling
        _oasListedParams.query.coords =
          _oasListedParams.query.coords.toUpperCase();
        //TODO: //Run hasZ and hasM checks beforehand
        //Check that the provided wkt actually matches wkt pattern

        //Will add option to validate per crs
        //Use eWKT functions to validate 3D/4D geometries

        /**
         * Check that the coords string starts with @type GeometryType
         * If @boolean false status=400
         * else, continue
         */

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
        if (
          !(await checkCoordsString_allowedGeometry(
            _oasListedParams.query.coords,
            allowedGeometryTypes
          ))
        ) {
          //console.log("This");
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

        try {
          const isValidWkt: any = await sequelize.query(
            `select ST_IsValidReason('${_oasListedParams.query.coords}'::geometry) as isvalid`,
            {
              type: QueryTypes.SELECT,
            }
          );
          if (isValidWkt) {
            if (isValidWkt[0].isvalid !== "Valid Geometry") {
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
    },
  };
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
