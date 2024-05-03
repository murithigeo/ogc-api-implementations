import { ExegesisContext, ExegesisOptions } from "exegesis-express";
import { collections_properties, allowed_F_values } from "..";
import {
  genCollectionsRootDoc,
  genOneCollectionDoc,
} from "../components/generateJsonDocs";
import initCommonQueryParams from "../components/params";
import convertJsonToYAML from "../components/convertToYaml";
import { F_AssociatedType } from "../../../types";

exports.getCollectionsAll = async function (context: ExegesisContext) {
  //context.res.status(200).setBody();
  const _collectionsAll = await genCollectionsRootDoc(
    context,
    collections_properties.collections,
    allowed_F_values
  );
  switch ((await initCommonQueryParams(context)).f) {
    case "json":
      context.res
        .status(200)
        .set("content-type", "application/json")
        .setBody(_collectionsAll);
      break;
    case "yaml":
      context.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_collectionsAll));
      break;
    default:
      context.res.status(400);
  }
};
exports.getCollectionOne = async function (context: ExegesisContext) {
  const { f } = await initCommonQueryParams(context);
  console.log(context.params.path);
  const _collectionDoc = await genOneCollectionDoc(
    context,
    allowed_F_values,
    collections_properties.collections.find(
      (collection) =>
        (collection.collectionId = context.params.path.collectionId)
    ),
    "specific"
  );
  switch (f) {
    case "yaml":
      context.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_collectionDoc));
      break;
    case "json":
      context.res.status(200).json(_collectionDoc);
      break;
    default:
      context.res.status(400).setBody(
        context.makeValidationError("Invalid f param", {
          in: "query",
          name: "f",
          docPath: context.api.pathItemPtr,
        })
      );
  }
};
