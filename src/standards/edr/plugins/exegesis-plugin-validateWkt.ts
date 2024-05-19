import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import sequelize from "../../../dbconnection";
import { QueryTypes } from "sequelize";

function makeExegesisPlugin(data: { apiDoc: any }): ExegesisPluginInstance {
  return {
    postSecurity: async (pluginContext: ExegesisPluginContext) => {
      //Construct url
      const _url = new URL(
        pluginContext.api.serverObject.url + pluginContext.req.url
      );
      //Initialize parameters
      const _oasListedParams = await pluginContext.getParams();

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
        //Run hasZ and hasM checks beforehand

        //Will add option to validate per crs
        //Use eWKT functions to validate 3D/4D geometries
        const isValidWkt = await sequelize.query(
          `select ST_IsValid('${_oasListedParams.query.coords}') as isValid`, 
          { type: QueryTypes.SELECT }
        );
        console.log(isValidWkt)
        if (!isValidWkt) {
          pluginContext.res.status(400).json(
            pluginContext.makeValidationError("Invalid WKT", {
              in: "query",
              name: "coords",
              docPath: pluginContext.api.pathItemPtr,
            })
          );
        } else {
          if (_url.pathname.includes("radius")) {
            //console.log(isValidWkt)
          }
        }
      }
    },
  };
}

function validateWktPlugin(): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-ogcedrwktvalidator_postgis",
    },
    makeExegesisPlugin: (data: { apiDoc: any }) => makeExegesisPlugin(data),
  };
}

export default validateWktPlugin