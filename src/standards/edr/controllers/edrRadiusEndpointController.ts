import { ExegesisContext } from "exegesis-express";
import * as edrIndex from "../index";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import getCovJsonData from "../components/queries/covjson";
import parseDbResToPointDomain from "../components/endpointDocs/covjson";
import getGeoJsonData from "../components/queries/geojson";
import { Model } from "sequelize";
import parseToFeatureCollection from "../components/endpointDocs/geojson";
import commonParams from "../../components/params";

let dbRes: { count: number; rows: Model<any, any>[] } = {
  count: 0,
  rows: [],
};

async function edrQueryRadiusAtCollection(ctx: ExegesisContext) {
  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  const f = (await commonParams(ctx)).f;
  switch (f.f) {
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
      switch (matchedCollection.modelName) {
        case "hourly2024":
          dbRes.rows = await getCovJsonData(ctx, matchedCollection);
          break;
      }
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

async function edrQueryRadiusAtInstance(ctx: ExegesisContext) {
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

export { edrQueryRadiusAtCollection, edrQueryRadiusAtInstance };
