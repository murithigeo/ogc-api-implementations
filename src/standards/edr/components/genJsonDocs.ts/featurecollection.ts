import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import parseDbResToEdrFeature from "../edrGeoJson/feature";
import genParamNameObj from "../collection_instanceParamNamesObject";
import deletePrevNextLinks from "../../../components/deletePrevNextLinks";
import numMatchedInit from "../../../components/numberMatched";
import edrCommonParams from "../params";

const edrGeoJSON_FeatureCollection_Gen = async (
  ctx: ExegesisContext,
  dbRes: any,
  count: number,
  geomColumnName: string,
  featureIdColumnName: string,
  edrVariables: types.collectionConfigEdrVariable[]
): Promise<types.EdrGeoJSONFeatureCollection> => {
  const { parameter_names } = await edrCommonParams(ctx);
  const pNames =
    ctx.params.query["parameter-name"] && parameter_names.length > 0
      ? parameter_names
      : edrVariables.map((variable) => variable.id);
  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberMatched: await numMatchedInit(ctx, count),
    numberReturned: dbRes.length,
    features: await parseDbResToEdrFeature(
      dbRes,
      geomColumnName,
      featureIdColumnName,
      pNames
    ),

    parameters: Object.values(await genParamNameObj(edrVariables)),
    links: await deletePrevNextLinks(ctx, [], count),
  };
};

export default edrGeoJSON_FeatureCollection_Gen;
