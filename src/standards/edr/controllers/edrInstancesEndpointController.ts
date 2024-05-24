import { ExegesisContext } from "exegesis-express";
import { genCollectionInfo } from "../components/genJsonDocs.ts/collections";
import * as types from "../types";
import sequelize from "../models";
import { Op, Sequelize } from "sequelize";
import return500InternalServerErr from "../../components/makeInternalServerError";
import { collectionsMetadata } from "..";
import { instanceIdStation } from "../components/helperScripts";

async function checkIfCollHasInstances(
  ctx: ExegesisContext,
  modelName: string,
  instanceColumn: string
) {
  const rows = await sequelize.models[modelName].findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col(instanceColumn)), "column"],
    ],
    where: {
      [Op.and]: [instanceIdStation(ctx)],
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
    matchedCollection.modelName,
    "station"
  );
  if (!matchedCollection.data_queries.instances || foundInstances.length < 1) {
    ctx.res
      .status(404)
      .json({
        message: `collection ${ctx.params.path.collectionId} has no instances`,
      })
      .end();
  }
  let instances: types.InstancesRoot = {
    instances: [],
    links: [],
  };
  for (const inst of foundInstances) {
    instances.instances.push(
      await genCollectionInfo(ctx, matchedCollection, inst)
    );
  }
  ctx.res.status(200).json(instances);
}

async function edrGetOneInstanceInCollection(ctx: ExegesisContext) {
  const matchedCollection = collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  const foundInstances = await checkIfCollHasInstances(
    ctx,
    matchedCollection.modelName,
    "station"
  );
  if (
    !matchedCollection.data_queries.instances ||
    !foundInstances.includes(ctx.params.path.instanceId)
  ) {
    ctx.res
      .status(404)
      .json({
        message: `collection ${ctx.params.path.collectionId} has no instances`,
      })
      .end();
  }
  const instance = await genCollectionInfo(
    ctx,
    matchedCollection,
    foundInstances[0]
  );
  ctx.res.status(200).json(instance);
}

export { edrGetOneInstanceInCollection, edrGetAllInstancesInCollection };
