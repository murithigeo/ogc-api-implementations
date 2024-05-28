import { ExegesisContext } from "exegesis-express";
import collectionHourly2024_QueryInterface from "../components/collectionsQueries/hourly";
import edrGeoJSON_FeatureCollection_Gen from "../components/genJsonDocs.ts/featurecollection";
import edrCommonParams from "../components/params";
import * as edrIndex from "../index";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";

async function edrQueryLocationsAtCollection_All(ctx: ExegesisContext) {
  const { parameter_names } = await edrCommonParams(ctx);
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
      ctx.res.status(400).json(await makeQueryValidationError(ctx));
  }
}

async function edrQueryLocationsAtInstance_All(ctx: ExegesisContext) {
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

async function edrQueryLocationsAtCollection_One(ctx: ExegesisContext) {
  const { parameter_names } = await edrCommonParams(ctx);
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

async function edrQueryLocationsAtInstance_One(ctx: ExegesisContext) {
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

export {
  edrQueryLocationsAtCollection_All,
  edrQueryLocationsAtInstance_One,
  edrQueryLocationsAtCollection_One,
  edrQueryLocationsAtInstance_All,
};
