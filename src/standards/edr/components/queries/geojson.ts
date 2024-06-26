import { ExegesisContext } from "exegesis-express";
import allWhereQueries, * as helperScripts from "../helperScripts";
import sequelize from "../../models";
import * as types from "../../types";
import { Op, Sequelize } from "sequelize";
import edrCommonParams from "../../../components/params";

const getGeoJsonData = async (
  ctx: ExegesisContext,
  matchedCollection: types.CollectionWithoutProps
) => {
  const params = await edrCommonParams(ctx);
  return await sequelize.models[matchedCollection.modelName].findAndCountAll({
    //Use this syntax instead of attributes:{include:[]} because the other will get columns that are not in exclude array
    attributes: [
      //Shape the geometry of returned geojson
      await helperScripts.transformToCrsOrForce2DQuery(
        ctx,
        matchedCollection.geomColumnName,
        //true
      ),
      ...(await helperScripts.includeColumnsToRetrieve(
        ctx,
        matchedCollection.edrVariables,
        "GEOJSON"
      )),
    ],
    where: await allWhereQueries(
      ctx,
      matchedCollection
    ),
    offset: params.offset ? params.offset : undefined,
    limit: params.limit ? params.limit : undefined,
    raw: true,
    order: [
      ["name", "ASC"],
      ["date", "ASC"],
    ],
    //@ts-expect-error
    includeIgnoreAttributes: false,
  });
};

export default getGeoJsonData;
