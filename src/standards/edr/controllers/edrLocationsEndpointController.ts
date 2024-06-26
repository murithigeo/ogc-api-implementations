import { ExegesisContext } from "exegesis-express";
import getGeoJsonData from "../components/queries/geojson";
import parseToFeatureCollection from "../components/endpointDocs/geojson";
import edrCommonParams from "../../components/params";
import * as edrIndex from "../index";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import parseDbResToPointDomain from "../components/endpointDocs/covjson";
import { Model } from "sequelize";
import getCovJsonData from "../components/queries/covjson";
import commonParams from "../../components/params";

let dbRes: { count: number; rows: Model<any, any>[] } = {
  count: 0,
  rows: [],
};

async function edrQueryLocationsAtCollection_All(ctx: ExegesisContext) {
  const matchedCollection = edrIndex.collectionsMetadata.find(
    (collection) => collection.id === ctx.params.path.collectionId
  );

  const f = (await commonParams(ctx)).f;
  switch (f.f) {
    case "GEOJSON":
      dbRes = (await getGeoJsonData(ctx, matchedCollection)) as any;
      const featureCollection = await parseToFeatureCollection(
        ctx,
        dbRes.rows,
        dbRes.count,
        matchedCollection
      );
      ctx.res
        .status(200)
        .set("Content-Type", f.contentType)
        .setBody(featureCollection);
      break;
    case "COVERAGEJSON":
      dbRes.rows = await getCovJsonData(ctx, matchedCollection);
      const covjson = await parseDbResToPointDomain(
        ctx,
        dbRes.rows,
        matchedCollection
      );
      ctx.res.status(200).set("content-type", f.contentType).setBody(covjson);
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx));
  }
}

async function edrQueryLocationsAtInstance_All(ctx: ExegesisContext) {
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
      ctx.res.status(200).set("content-type", f.contentType).setBody(covjson);
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx));
  }
}

async function edrQueryLocationsAtCollection_One(ctx: ExegesisContext) {
  const { parameter_names } = await edrCommonParams(ctx);
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
        .set("Content-Type", f.contentType)
        .setBody(featureCollection);
      break;
    case "COVERAGEJSON":
      dbRes.rows = await getCovJsonData(ctx, matchedCollection);

      const covjson = await parseDbResToPointDomain(
        ctx,
        dbRes.rows,
        matchedCollection
      );
      ctx.res.status(200).set("content-type", f.contentType).setBody(covjson);
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx));
  }
}

async function edrQueryLocationsAtInstance_One(ctx: ExegesisContext) {
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
        .set("Content-Type", f.contentType)
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

export {
  edrQueryLocationsAtCollection_All,
  edrQueryLocationsAtInstance_One,
  edrQueryLocationsAtCollection_One,
  edrQueryLocationsAtInstance_All,
};
