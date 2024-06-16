import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeQueryValidationError from "../../components/makeValidationError";
import { validateCrsUri } from "../params";

export default function makeBboxParserValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const oasListedQueryParams = (await ctx.getParams()).query;
      if (oasListedQueryParams.bbox) {
        const bboxParam: number[] = oasListedQueryParams.bbox;
        const crs = await validateCrsUri(oasListedQueryParams.crs);
      }
    },
  };
}
