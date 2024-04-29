import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import { URL } from "url";
function makeExegesisPlugin(data: { apiDoc: any }): ExegesisPluginInstance {
  return {
    postSecurity: async (pluginContext: ExegesisPluginContext) => {
      let url = new URL(
        pluginContext.api.serverObject.url + pluginContext.req.url
      );

      ////@ts-expect-error
      const sentParams = Array.from(new URLSearchParams(url.search).keys());

      const allowedParams: string[] = ["apiKey"];
      const pluginContextParams = (await pluginContext.getParams()).query;

      if (Object.keys(pluginContextParams).length > 0) {
        allowedParams.push(...Object.keys(pluginContextParams));
      }
      const unexpectedParams = sentParams.filter(
        (param) => !allowedParams.includes(param)
      );
      if (unexpectedParams.length > 0) {
        pluginContext.res.status(400).setBody(
          pluginContext.makeValidationError("Invalid query parameter", {
            in: "query",
            docPath: pluginContext.api.pathItemPtr,
            name: JSON.stringify(unexpectedParams),
          })
        );
      }
    },
  };
}

function pluginInit(): ExegesisPlugin {
  return {
    info: {
      name: "exegesis-plugin-undocumentedqueryparams",
    },
    makeExegesisPlugin: makeExegesisPlugin,
  };
}

export default pluginInit;
