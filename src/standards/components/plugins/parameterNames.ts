import {
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";

import * as edrIndex from "../../edr/index";
import makeQueryValidationError from "../../components/makeValidationError";


export default function makeParameterNamesValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      const oasListedParams = await ctx.getParams();
      const matchedCollection = edrIndex.collectionsMetadata.find(
        (collection) => collection.id === oasListedParams.path.collectionId
      );

      if (oasListedParams.query["parameter-name"]) {
        const unlistedParamNames = (
          oasListedParams.query["parameter-name"] as string
        )
          .split(",")
          .filter(
            (pName) => !matchedCollection.parameter_names.includes(pName)
          );
        if (unlistedParamNames.length > 0) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "param-name",
                "The following query params are not listed in the collections metadata thus are INVALID: " +
                  unlistedParamNames.join(",")
              )
            )
            .end();
          return;
        }
      }
    },
  };
}
