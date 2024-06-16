import { ExegesisContext } from "exegesis-express";
import edrGeoJSON_FeatureCollection_Gen from "../components/endpointDocs/geojson"
import collectionHourly2024_QueryInterface from "../components/queries/geojson";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import * as edrIndex from "../index";

async function edrQueryCorridorAtCollection(ctx: ExegesisContext) {
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

async function edrQueryCorridorAtInstance(ctx: ExegesisContext) {
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

export { edrQueryCorridorAtInstance, edrQueryCorridorAtCollection };
