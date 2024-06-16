import { ExegesisContext, ExegesisOptions } from "exegesis-express";
import { collections_properties, allowed_F_values } from "..";
import {
  genCollectionsRootDoc,
  genOneCollectionDoc,
} from "../components/generateJsonDocs";
import initCommonQueryParams from "../../components/params";
import convertJsonToYAML from "../../components/convertToYaml";
import { F_AssociatedType } from "../../../types";

async function getCollectionsAll(ctx: ExegesisContext) {
  //ctx.res.status(200).setBody();
  const _collectionsAll = await genCollectionsRootDoc(
    ctx,
    collections_properties.collections,
    allowed_F_values
  );
  switch (ctx.params.query.f) {
    case "json":
      ctx.res
        .status(200)
        .set("content-type", "application/json")
        .setBody(_collectionsAll);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_collectionsAll));
      break;
    default:
      ctx.res.status(400);
  }
}
async function getCollectionOne(ctx: ExegesisContext) {
  //const { f } = await initCommonQueryParams(ctx);
  const _collectionDoc = await genOneCollectionDoc(
    ctx,
    allowed_F_values,
    collections_properties.collections.find(
      (collection) =>
        (collection.id = ctx.params.path.collectionId)
    ),
    "specific"
  );
  switch (ctx.params.query.f) {
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_collectionDoc));
      break;
    case "json":
      ctx.res.status(200).json(_collectionDoc);
      break;
    default:
      ctx.res.status(400).setBody(
        ctx.makeValidationError("Invalid f param", {
          in: "query",
          name: "f",
          docPath: ctx.api.pathItemPtr,
        })
      );
  }
}

export { getCollectionOne, getCollectionsAll };
