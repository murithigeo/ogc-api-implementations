import * as types from "../../types";
import * as observationParsers from "../parseWeatherData";
import edrQueryEndpointLink from "../links/edrQueryEndpoint";
import featureLink from "../links/edrGeoJSON";
import { ExegesisContext } from "exegesis-express";
import genParamNameObj from "../collection_instanceParamNamesObject";
import deletePrevNextLinks from "../../../components/deletePrevNextLinks";
import numMatchedInit from "../../../components/numberMatched";
import edrCommonParams from "../../../components/params";
import featureCollectionLinks from "../links/featurecollection";
import commonParams from "../../../components/params";

const parseDbResToEdrFeature = async (
  ctx: ExegesisContext,
  dbRes: any,
  matchedCollection: types.CollectionWithoutProps
): Promise<types.EdrGeoJSONFeature[]> => {
  const features: types.EdrGeoJSONFeature[] = [];
  if (dbRes.length < 1) {
    return features;
  } else {
    for (const row of dbRes) {
      const {
        [matchedCollection.geomColumnName]: geom,
        [matchedCollection.pkeyColumn]: id,
        ...others
      } = row;
      const { type, coordinates } = geom;

      features.push({
        type: "Feature",
        id,
        geometry: { type, coordinates },
        properties: {
          datetime: others[matchedCollection.datetimeColumn],
          edrqueryendpoint: await edrQueryEndpointLink(
            ctx,
            (
              await commonParams(ctx)
            ).locationId
          ),
          "parameter-name":
            (await commonParams(ctx)).parameter_names ??
            matchedCollection.edrVariables.map((variable) => variable.id),
          ...others,
        },
      });
    }
  }
  return features;
};

const parseToFeatureCollection = async (
  ctx: ExegesisContext,
  dbRes: any,
  count: number,
  matchedCollection: types.CollectionWithoutProps
): Promise<types.EdrGeoJSONFeatureCollection> => {
  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberMatched: await numMatchedInit(ctx, count),
    numberReturned: dbRes.length,
    features: await parseDbResToEdrFeature(ctx, dbRes, matchedCollection),
    parameters: Object.values(
      await genParamNameObj(matchedCollection.edrVariables)
    ),
    links: await deletePrevNextLinks(
      ctx,
      await featureCollectionLinks(ctx, [
        { f: "json", contentType: "application/json" },
        { f: "yaml", contentType: "text/yaml" },
      ]),
      count
    ),
  };
};

export default parseToFeatureCollection;
