import {
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import contentNegotiationValues from "../../components/contentNegotiation";
import makeQueryValidationError from "../../components/makeValidationError";
import { allowedQueryTypes } from ".";

export default function MakeFParserValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const oasListedParams = await ctx.getParams();
      //console.log("fplugin", oasListedQueryParams.f);

      oasListedParams.query.f = !oasListedParams.query.f
        ? allowedQueryTypes
            .filter((qType) => qType !== "instances")
            .some((str) => ctx.req.url.includes(str))
          ? "GEOJSON"
          : "JSON"
        : oasListedParams.query.f;

      oasListedParams.query.f = (
        oasListedParams.query.f as string
      ).toUpperCase();

      const f = oasListedParams.query.f;

      if (
        !contentNegotiationValues
          .map((val) => val.f)
          .includes(oasListedParams.query.f)
      ) {
        ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
      }

      oasListedParams.query.parsedf = contentNegotiationValues.find(
        (val) => val.f === f
      );
    },
  };
}
