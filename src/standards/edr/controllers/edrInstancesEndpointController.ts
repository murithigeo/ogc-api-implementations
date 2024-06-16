import { ExegesisContext } from "exegesis-express";
import { genCollectionInfo } from "../components/endpointDocs/json/collections"
import * as types from "../types";
import sequelize from "../models";
import { Op, Sequelize } from "sequelize";
import { collectionsMetadata } from "..";
import * as helperScripts from "../components/helperScripts";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import { edrCollectionsInstancesRoot } from "../components/links/path_collections";

async function checkIfCollHasInstances(
  ctx: ExegesisContext,
  modelName: string
) {
  const rows = await sequelize.models[modelName].findAll({
    attributes: [
      [
        Sequelize.fn("DISTINCT", Sequelize.col(ctx.params.query.instancemode)),
        "column",
      ],
    ],
    where: {
      [ctx.params.query.instancemode as string]: {
        [Op.ne]: null || "",
      },
    },

    raw: true,

    //@ts-expect-error
    includeIgnoreAttributes: false,
  });
  return rows.map((row: any) => row.column) as Array<string>;
}

async function edrGetAllInstancesInCollection(ctx: ExegesisContext) {
  const matchedCollection = collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  const foundInstances = await checkIfCollHasInstances(
    ctx,
    matchedCollection.modelName
  );

  if (foundInstances.length < 1) {
    ctx.res
      .status(404)
      .json({
        message: `collection ${ctx.params.path.collectionId} has no instances`,
      })
      .end();
    return;
  }
  let instances: types.InstancesRoot = {
    instances: [],
    links: await edrCollectionsInstancesRoot(ctx, [
      { f: "json", contentType: "application/json" },
      { f: "yaml", contentType: "text/yaml" },
    ]),
  };

  for (const inst of foundInstances) {
    ctx.params.path.instanceId = inst;
    instances.instances.push(await genCollectionInfo(ctx, matchedCollection));
  }
  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).json(instances).end();
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(instances))
        .end();
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

async function edrGetOneInstanceInCollection(ctx: ExegesisContext) {
  const matchedCollection = collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  const foundInstances = await checkIfCollHasInstances(
    ctx,
    matchedCollection.modelName
  );
  if (!matchedCollection.data_queries.instances) {
    ctx.res
      .status(400)
      .json(
        ctx.makeValidationError(
          `The collection ${ctx.params.path.collectionId} has no instances available. Check its metadata for correct requests`,
          {
            in: "path",
            name: "instanceId",
            docPath: ctx.api.pathItemPtr,
          }
        )
      )
      .end();
    return;
  }
  if (!foundInstances.includes(ctx.params.path.instanceId)) {
    ctx.res.status(404).json({
      message: `collection ${ctx.params.path.collectionId} has no instances`,
    });
    return;
  }

  const instance = await genCollectionInfo(ctx, matchedCollection);
  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).setBody(instance); //.end();
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(instance));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

export { edrGetOneInstanceInCollection, edrGetAllInstancesInCollection };
