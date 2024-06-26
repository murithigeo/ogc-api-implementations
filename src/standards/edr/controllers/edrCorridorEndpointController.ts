import { ExegesisContext } from "exegesis-express";
import edrGeoJSON_FeatureCollection_Gen from "../components/endpointDocs/geojson";
import collectionHourly2024_QueryInterface from "../components/queries/geojson";
import convertJsonToYAML from "../../components/convertToYaml";
import makeQueryValidationError from "../../components/makeValidationError";
import * as edrIndex from "../index";
import commonParams from "../../components/params";
import getGeoJsonData from "../components/queries/geojson";
import parseToFeatureCollection from "../components/endpointDocs/geojson";
import getCovJsonData from "../components/queries/covjson";
import parseDbResToPointDomain from "../components/endpointDocs/covjson";
import { Model } from "sequelize";

let dbRes: { count: number; rows: Model<any, any>[] } = {
  count: 0,
  rows: [],
};

async function edrQueryCorridorAtCollection(ctx: ExegesisContext) {
  //const {  parameter_names } = await edrCommonParams(ctx);
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
        //.set("content-type", "application/vnd.cov+json")
        .set("content-type", f.contentType)
        .setBody(covjson);
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx));
  }
}

async function edrQueryCorridorAtInstance(ctx: ExegesisContext) {
  //const {  parameter_names } = await edrCommonParams(ctx);

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
        //.set("content-type", "application/vnd.cov+json")
        .set("content-type", f.contentType)
        .setBody(covjson);
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx));
  }
}

export { edrQueryCorridorAtInstance, edrQueryCorridorAtCollection };
