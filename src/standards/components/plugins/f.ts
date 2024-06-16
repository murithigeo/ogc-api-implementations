import {
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import contentNegotiationValues from "../../components/contentNegotiation";
import makeQueryValidationError from "../../components/makeValidationError";

export default function MakeFParserValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const oasListedParams = await ctx.getParams();
      //console.log("fplugin", oasListedQueryParams.f);
      if (oasListedParams.query.f) {
        oasListedParams.query.f = (
          oasListedParams.query.f as string
        ).toUpperCase();
        if (
          !contentNegotiationValues
            .map((val) => val.f)
            .includes(oasListedParams.query.f)
        ) {
          ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
        }

        let f = oasListedParams.query.f;

        if (
          oasListedParams.path.featureId ||
          (ctx.req.url.includes("items") && oasListedParams.query.f === "JSON")
        ) {
          f = "GEOJSON";
        }
        oasListedParams.query.parsedf = contentNegotiationValues.find(
          (val) => val.f === f
        );
      }
    },
  };
}
