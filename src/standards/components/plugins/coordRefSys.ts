import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import * as crsDetails from "../../components/crsdetails";
import makeQueryValidationError from "../../components/makeValidationError";
export default function makeCoordsRefSysParserValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const oasListedQueryParams = (await ctx.getParams()).query;
      if (oasListedQueryParams.crs) {
        if (
          !URL.canParse(oasListedQueryParams.crs) || //If the received crs param is not an url, =>400 or not in the global list of coordinate reference systems
          !crsDetails._allsupportedcrsUris.includes(oasListedQueryParams.crs)
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "crs",
                !URL.canParse(oasListedQueryParams.crs)
                  ? "CRS must be in the uri syntax http://www.opengis.net/def/crs/{authority}/{version}/{code} to reduce complexity"
                  : "The CRS requested is not currently supported by this server"
              )
            );
          return;
        }
      }

      /**
       * @description Do the same for @param bboxcrs
       */
      if (oasListedQueryParams["bbox-crs"]) {
        if (
          !URL.canParse(oasListedQueryParams["bbox-crs"]) ||
          !crsDetails._allsupportedcrsUris.includes(
            oasListedQueryParams["bbox-crs"]
          )
        ) {
          console.log("bboxts", oasListedQueryParams["bbox-crs"]);
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "bbox-crs",
                !URL.canParse(oasListedQueryParams["bbox-crs"])
                  ? "CRS must be in the uri syntax http://www.opengis.net/def/crs/{authority}/{version}/{code} to reduce complexity"
                  : "The CRS requested is not currently supported by this server"
              )
            );
          return;
        }
      }
    },
  };
}
