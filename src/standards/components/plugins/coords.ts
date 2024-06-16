import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeQueryValidationError from "../../components/makeValidationError";
import sequelize from "../models";
import { validateCrsUri } from "../params";
import { QueryTypes } from "sequelize";
import return500InternalServerErr from "../../components/makeInternalServerError";
import { allowedQueryTypes } from ".";

export default function makeCoordsPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const queryParamsInterface = (await ctx.getParams()).query;
      const reqUrl = new URL(ctx.api.serverObject.url + ctx.req.url);


      /**
       * @description Validate Well Known Text (wkt) strings. Only for @param coords
       *
       */
      if (queryParamsInterface.coords) {
        // Convert the coords param to uppercase
        queryParamsInterface.coords = queryParamsInterface.coords.toUpperCase();

        /**
         * @returns 400 if @param crs is undefined
         */
        if (!queryParamsInterface.crs) {
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
            reqUrl.pathname.endsWith(queryType)
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
            queryParamsInterface.coords.split("(")[0].trim()
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
          (queryParamsInterface.coords as string).startsWith("LINESTRINGZM") &&
          (queryParamsInterface.z || queryParamsInterface.datetime)
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "coords|" + queryParamsInterface.z ? "z" : "datetime",
                "A LINESTRINGZM wkt & datetime | z cannot be defined at the same time"
              )
            );
          return;
        }

        /**
         * @description validate that if @coords is not defined at the same time as @param z for LINESTRINGZ
         */
        if (
          (queryParamsInterface.coords as string).startsWith("LINESTRINGZ") &&
          queryParamsInterface.z
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
          (queryParamsInterface.coords as string).startsWith("LINESTRINGM") &&
          queryParamsInterface.datetime
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
                      queryParamsInterface.coords as string
                    }',${
              (
                await validateCrsUri(queryParamsInterface.crs)
              ).srid
            }),3857)
                    )).geom as newgeom)
                    Select  max(ST_Z(newgeom)) as zmax,
                            min(ST_Z(newgeom)) as zmin, 
                            to_timestamp(max(ST_M(newgeom))) as mmax,
                            to_timestamp(min(ST_M(newgeom))) as mmin, 
                            ST_AsText(ST_Force2D(ST_Transform(ST_GeometryFromText('${
                              queryParamsInterface.coords
                            }',${
              (
                await validateCrsUri(queryParamsInterface.crs)
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
          queryParamsInterface.parsedcoords = {
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
    },
  };
}

