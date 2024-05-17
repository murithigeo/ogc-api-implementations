import {
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import sequelize from "../../../dbconnection";

function makeExegesisPlugin(data: { apiDoc: any }): ExegesisPluginInstance {
  return {
    postSecurity: async (pluginContext: ExegesisPluginContext) => {
      //Initialize parameters
      const _oasListedParams = await pluginContext.getParams();

      //Optional Params
      const _oasListedQueryParams= _oasListedParams.query;

      //Validate wkt strings
      if(_oasListedQueryParams.coords){
        
      }
    },
  };
}
