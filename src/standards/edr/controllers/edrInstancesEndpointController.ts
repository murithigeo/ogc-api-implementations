import { ExegesisContext } from "exegesis-express";
import { genCollectionInfo } from "../components/genJsonDocs.ts/collections";
import * as types from '../types'
async function edrGetAllInstancesInCollection(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .setBody(
      `Endpoint for {root}/${ctx.route.path}; collectionId= ${ctx.params.path.collectionId}`
    );
}

async function edrGetOneInstanceInCollection(ctx: ExegesisContext) {
  const collection: types.Collection = await genCollectionInfo(ctx, {
    id: "hourly",
    modelName: "hourly2024",
    edrVariables: [],
    allSupportedCrs: [],
    datetimeColumns: ["date"],
    output_formats: [],
    default_output_format: "",
    data_queries: {},
  });
  ctx.res.status(200).json(collection);
}

export { edrGetOneInstanceInCollection, edrGetAllInstancesInCollection };
