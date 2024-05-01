import { ExegesisContext, ExegesisOptions } from "exegesis-express";
import { _listOfCollections, collections } from "..";
import {
  genCollectionsRootDoc,
  genOneCollectionDoc,
} from "../components/generateJsonDocs";
import initCommonQueryParams from "../components/params";
import convertJsonToYAML from "../components/convertToYaml";
import { F_AssociatedType } from "../../../types";
const allowedTypes: F_AssociatedType[] = [
  { f: "json", type: "application/json" },
  { f: "yaml", type: "text/yaml" },
];
exports.getCollectionsAll = async function (context: ExegesisContext) {
  //context.res.status(200).setBody();
  const _collectionsAll = await genCollectionsRootDoc(
    context,
    collections,
    allowedTypes
  );
  console.log(_collectionsAll)
  context.res.status(200).setBody(_collectionsAll)
};
exports.getCollectionOne = async function (context: ExegesisContext) {
  const { f } = await initCommonQueryParams(context);
  const _collectionDoc = await genOneCollectionDoc(
    context,
    allowedTypes,
    collections.find(
      (collection) =>
        (collection.collectionId = context.params.path.collectionId)
    ),
    "nested"
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
