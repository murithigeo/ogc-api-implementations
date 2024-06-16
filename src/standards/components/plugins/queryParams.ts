import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeQueryValidationError from "../../components/makeValidationError";

export default function makeQueryParamsParserValidatorPlugin(
  undocumentedQueryParamsToIgnore: string[]
): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const reqUrl = new URL(ctx.api.serverObject.url + ctx.req.url);
      const oasListedQueryParams = (await ctx.getParams()).query;
      //Access all params present on req.url
      const _allQueryParams = Array.from(
        new URLSearchParams(reqUrl.search).keys()
      );

      //undocumented (not defined in the oas doc)
      const allowedQueryParams: string[] = [];

      //Push queryParamsToIgnore
      if (undocumentedQueryParamsToIgnore.length > 0) {
        allowedQueryParams.push(...undocumentedQueryParamsToIgnore);
      }

      //Push documented params to allowedQueryParams array
      if (Object.keys(oasListedQueryParams).length > 0) {
        allowedQueryParams.push(...Object.keys(oasListedQueryParams));
      }

      //Filter the _allQueryParams using the _oasListedParams.query keys and return an array with the undocumented queryParams detected
      const unexpectedParams = _allQueryParams.filter(
        (param) => !allowedQueryParams.includes(param)
      );

      //return 400 if undocumented and non-ignored params present

      if (unexpectedParams.length > 0) {
        ctx.res
          .status(400)
          .json(await makeQueryValidationError(ctx, "Unexpected Query Parameter(s): "+unexpectedParams.join("|")))
          .end();
        return;
      }
    },
  };
}