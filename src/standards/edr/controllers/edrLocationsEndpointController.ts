import { ExegesisContext } from "exegesis-express";
import collectionHourly2024_QueryInterface, {
  hourly2024CovJSON_Interface,
} from "../components/queries/geojson";
import edrGeoJSON_FeatureCollection_Gen from "../components/endpointDocs/geojson"
import edrCommonParams from "../../components/params";
import * as edrIndex from "../index";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import { parseDbResToPointDomain } from "../components/endpointDocs/covjson";
import { Model } from "sequelize";

async function edrQueryLocationsAtCollection_All(ctx: ExegesisContext) {
  const { parameter_names } = await edrCommonParams(ctx);
  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  let dbRes: { count: number, rows:Model<any, any>[] }={count:0,rows:[]};
  switch (ctx.params.query.f) {
    case "GEOJSON":
      switch (matchedCollection.modelName) {
        case "hourly2024":
          dbRes = await collectionHourly2024_QueryInterface(
            ctx,
            matchedCollection
          ) as any
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
      ctx.res
        .status(200)
        .set("Content-Type", "application/geo+json")
        .setBody(featureCollection);
      break;
    case "COVERAGEJSON":
      switch (matchedCollection.modelName) {
        case "hourly2024":
           dbRes.rows = await hourly2024CovJSON_Interface(
            ctx,
            matchedCollection
          );
          break;
      }
      console.log("pnames",parameter_names)
      const covjson = await parseDbResToPointDomain(
        ctx,
        dbRes.rows,
        matchedCollection,
        ctx.params.query["parameter-name"] && parameter_names.length > 0
          ? parameter_names
          : matchedCollection.edrVariables.map((variable) => variable.id)
      );
      ctx.res
        .status(200)
        .set("content-type", "application/vnd.cov+json")
        .set("content-type", "application/prs.coverage+json")
        .setBody(covjson);
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
