import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeQueryValidationError from "../../components/makeValidationError";

export default function makeCubeOperationsValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const reqUrl = new URL(ctx.api.serverObject.url + ctx.req.url);
      const oasListedQueryParams = (await ctx.getParams()).query;
      /**
       * @description Force user to provide@param bbox. This is because the bbox schema in edrSchemas does not say required:true
       */
      if (reqUrl.pathname.endsWith("cube")) {
        if (!oasListedQueryParams.bbox) {
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
    },
  };
}
