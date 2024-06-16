import {
  ExegesisPlugin,
  ExegesisPluginContext,
  ExegesisPluginInstance,
} from "exegesis-express";
import makeQueryValidationError from "../../components/makeValidationError";
import { allowedQueryTypes } from ".";
import * as edrIndex from "../../edr/index";
import { collections_properties } from "../../features";
export default function makeCollectionOrInstanceIdValidatorPlugin(): ExegesisPluginInstance {
  return {
    postSecurity: async (ctx: ExegesisPluginContext) => {
      //Construct url
      const _url = new URL(ctx.api.serverObject.url + ctx.req.url);
      //Initialize parameters
      const _oasListedParams = await ctx.getParams();

      //Force definition of bbox on certain paths.

      if (
        _oasListedParams.path.collectionId === "" ||
        _oasListedParams.path.instanceId === ""
      ) {
        ctx.res
          .status(400)
          .json(
            ctx.makeValidationError(
              "collectionId or instanceId cannot be an empty string",
              {
                in: "path",
                name: _oasListedParams.path.instanceId
                  ? "instanceId"
                  : "collectionId",
                docPath: ctx.api.pathItemPtr,
              }
            )
          )
          .end();
        return;
      }

      //Validate CollectionIds
      if (_oasListedParams.path.collectionId) {
        if (
          !(
            _url.pathname.includes("edr")
              ? edrIndex.collectionsMetadata
              : collections_properties.collections
          )
            .map((collection) => collection.id)
            .includes(_oasListedParams.path.collectionId)
        ) {


          ctx.res.status(404).json({
            message: `Collection: ${_oasListedParams.path.collectionId} does not exist`,
          });
          ///.end();
          return;
        }

        const matchedCollection = (
          _url.pathname.includes("edr")
            ? edrIndex.collectionsMetadata
            : collections_properties.collections
        ).find(
          (collection) => collection.id === _oasListedParams.path.collectionId
        );

        const dQuery = allowedQueryTypes.filter((queryType) =>
          //_url.pathname.endsWith(queryType) ||
          _url.pathname.includes(queryType)
        );
        for (const query of dQuery) {
          /**
           * @description Disallow specific paths for a collection if it does not have them
           * @example a matched collection does not support a location query. Check if path includes that keyword. If true, error 400
           */
          if (!matchedCollection.data_queries[query]) {
            ctx.res
              .status(404)
              .json(
                ctx.makeValidationError(
                  `${matchedCollection.id} does not server via this endpoint`,
                  { in: "path", name: query, docPath: ctx.api.pathItemPtr }
                )
              );
            return;
          }
        }

        if (
          "corridor" in matchedCollection.data_queries &&
          _url.pathname.endsWith("corridor") &&
          !matchedCollection.data_queries.corridor.height_units.includes(
            _oasListedParams.query["height-units"]
          )
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "height-units",
                "The unit provided is not currently supported by this collection"
              )
            );
        }

        if (
          "corridor" in matchedCollection.data_queries &&
          _url.pathname.endsWith("corridor") &&
          !matchedCollection.data_queries.corridor.width_units.includes(
            _oasListedParams.query["width-units"]
          )
        ) {
          ctx.res
            .status(400)
            .json(
              await makeQueryValidationError(
                ctx,
                "width-units",
                "The unit provided is not currently supported by this collection"
              )
            );
        }
        if (
          _url.pathname.endsWith("radius") &&
          "radius" in matchedCollection.data_queries
        ) {
          if (
            !matchedCollection.data_queries.radius.within_units.includes(
              _oasListedParams.query["within-units"]
            )
          ) {
            ctx.res
              .status(400)
              .json(
                await makeQueryValidationError(
                  ctx,
                  "within-units",
                  "Units provided not supported by this endpoint"
                )
              )
              .end();
            return;
          }
        }
      }
    },
  };
}
