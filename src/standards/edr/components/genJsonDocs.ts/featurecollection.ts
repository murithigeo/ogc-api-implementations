import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import parseDbResToEdrFeature from "../edrGeoJson/feature";
import genParamNameObj from "../collection_instanceParamNamesObject";
import deletePrevNextLinks from "../../../components/deletePrevNextLinks";
import numMatchedInit from "../../../components/numberMatched";

const edrGeoJSON_FeatureCollection_Gen = async (
  ctx: ExegesisContext,
  dbRes: any,
  count: number,
  parameter_names: string[],
  geomColumnName: string,
  featureIdColumnName: string,
  edrVariables: types.collectionConfigEdrVariable[]
): Promise<types.EdrGeoJSONFeatureCollection> => {
  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberMatched: await numMatchedInit(ctx, count),
    numberReturned: dbRes.length,
    features: await parseDbResToEdrFeature(
      dbRes,
      geomColumnName,
      featureIdColumnName,
      parameter_names
    ),

    parameters: Object.values(await genParamNameObj(edrVariables)),
    links: await deletePrevNextLinks(ctx, [], count),
  };
};

export default edrGeoJSON_FeatureCollection_Gen;
