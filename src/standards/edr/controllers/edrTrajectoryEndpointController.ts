import { ExegesisContext } from "exegesis-express";
import * as edrIndex from "../index";
import collectionHourly2024_QueryInterface from "../components/queries/geojson";
import edrGeoJSON_FeatureCollection_Gen from "../components/endpointDocs/geojson";
import makeQueryValidationError from "../../components/makeValidationError";
import convertJsonToYAML from "../../components/convertToYaml";
import getGeoJsonData from "../components/queries/geojson";
import parseToFeatureCollection from "../components/endpointDocs/geojson";
import getCovJsonData from "../components/queries/covjson";
import parseDbResToPointDomain from "../components/endpointDocs/covjson";
import { Model } from "sequelize";

let dbRes: { count: number; rows: Model<any, any>[] } = {
  count: 0,
  rows: [],
};

async function edrQueryTrajectoryAtCollection(ctx: ExegesisContext) {
  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  switch (ctx.params.query.f) {
    case "GEOJSON":
      dbRes = await getGeoJsonData(ctx, matchedCollection);
      const featureCollection = await parseToFeatureCollection(
        ctx,
        dbRes.rows,
        dbRes.count,
        matchedCollection
      );
      ctx.res
        .status(200)
        .set("Content-Type", "application/geo+json")
        .setBody(featureCollection);
      break;
    case "COVERAGEJSON":
      dbRes.rows = await getCovJsonData(ctx, matchedCollection);
      const covjson = await parseDbResToPointDomain(
        ctx,
        dbRes.rows,
        matchedCollection
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

async function edrQueryTrajectoryAtInstance(ctx: ExegesisContext) {
  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  switch (ctx.params.query.f) {
    case "GEOJSON":
      dbRes = await getGeoJsonData(ctx, matchedCollection);
      const featureCollection = await edrGeoJSON_FeatureCollection_Gen(
        ctx,
        dbRes.rows,
        dbRes.count,
        matchedCollection
      );
      ctx.res
        .status(200)
        .set("Content-Type", "application/geo+json")
        .setBody(featureCollection);
      break;
    case "COVERAGEJSON":
      dbRes.rows = await getCovJsonData(ctx, matchedCollection);
      const covjson = await parseDbResToPointDomain(
        ctx,
        dbRes.rows,
        matchedCollection
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

export { edrQueryTrajectoryAtCollection, edrQueryTrajectoryAtInstance };
