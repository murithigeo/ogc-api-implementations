import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { supportedcrs_array } from "../standards/features/crsconfig";
import { validate_crs_string } from "../standards/features/components/params";

function makeExegesisPlugin(data: { apiDoc: any }): ExegesisPluginInstance {
  return {
    postSecurity: async (pluginContext: ExegesisPluginContext) => {
      const params = (await pluginContext.getParams()).query;
      if (params.crs || params["bbox-crs"]) {
        const bboxcrsArray = await validate_crs_string(params["bbox-crs"]);
        const crsArray = await validate_crs_string(params.crs);
        if (crsArray.length < 1) {
          pluginContext.res.status(400).setBody(
            pluginContext.makeValidationError("crs invalid or unsupported", {
              in: "query",
              name: "crs",
              docPath: pluginContext.api.pathItemPtr,
            })
          );
        }
        if (bboxcrsArray.length < 1) {
          pluginContext.res.status(400).setBody(
            pluginContext.makeValidationError(
              "bbox-crs invalid or unsupported",
              {
                in: "query",
                name: "bbox-crs",
                docPath: pluginContext.api.pathItemPtr,
              }
            )
          );
        }
      }
    },
  };
}

function bboxcrs_crsPlugin(): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-validatecrsbboxcrs",
    },
    makeExegesisPlugin: makeExegesisPlugin,
  };
}
export default bboxcrs_crsPlugin;
