import { ExegesisContext } from "exegesis-express";
import edrCommonParams from "../../components/params";
import sequelize from "../models";
import * as edrIndex from "../index";
import makeQueryValidationError from "../../components/makeValidationError";
import * as types from "../types";
import convertJsonToYAML from "../../components/convertToYaml";
import edrGeoJSON_FeatureCollection_Gen from "../components/endpointDocs/geojson"
import collectionHourly2024_QueryInterface from "../components/queries/geojson";

async function edrQueryCubeAtCollection(ctx: ExegesisContext) {
  //const {  parameter_names } = await edrCommonParams(ctx);

  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  let dbRes: { count: number; rows: any };
  switch (matchedCollection.modelName) {
    case "hourly2024":
      dbRes = await collectionHourly2024_QueryInterface(ctx, matchedCollection);
      break;
  }

  const featureCollection = await edrGeoJSON_FeatureCollection_Gen(
    ctx,
    dbRes.rows,
    dbRes.count,
    //parameter_names,
    "geom",
    "station",
    matchedCollection.edrVariables
  );
  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).json(featureCollection);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(featureCollection));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

async function edrQueryCubeAtInstance(ctx: ExegesisContext) {

  console.log(ctx.params.query.datetime)
  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  let dbRes: { count: number; rows: any };
  switch (matchedCollection.modelName) {
    case "hourly2024":
      dbRes = await collectionHourly2024_QueryInterface(ctx, matchedCollection);
      break;
  }

  const featureCollection = await edrGeoJSON_FeatureCollection_Gen(
    ctx,
    dbRes.rows,
    dbRes.count,
    matchedCollection.geomColumnName,
    "station",
    matchedCollection.edrVariables
  );
  switch (ctx.params.query.f) {
    case "json":
      ctx.res.status(200).json(featureCollection);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(featureCollection));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

export { edrQueryCubeAtCollection, edrQueryCubeAtInstance };
