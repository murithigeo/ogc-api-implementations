import { ExegesisContext } from "exegesis-express";

import * as types from "../types";
import { genCollectionInfo } from "../components/endpointDocs/json/collections";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import { collectionsMetadata } from "..";
import * as collectionsInstancesRootLinks from "../components/links/path_collections";

async function edrGetCollectionsRoot(ctx: ExegesisContext) {
  const collections: types.CollectionsRoot = {
    collections: [],
    links: await collectionsInstancesRootLinks.edrCollectionsInstancesRoot(
      ctx,
      [
        { f: "json", contentType: "application/json" },
        { f: "yaml", contentType: "text/yaml" },
      ]
    ),
  };
  for (const collectionConfig of collectionsMetadata) {
    ctx.params.path.collectionId = collectionConfig.id;
    collections.collections.push(
      await genCollectionInfo(ctx, collectionConfig)
    );
  }
  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).json(collections);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(collections));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

async function edrGetOneCollection(ctx: ExegesisContext) {
  const collection: types.Collection = await genCollectionInfo(
    ctx,
    collectionsMetadata.find(
      (collection) => collection.id === ctx.params.path.collectionId
    )
  );

  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).json(collection);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(collection));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

export { edrGetCollectionsRoot, edrGetOneCollection };
