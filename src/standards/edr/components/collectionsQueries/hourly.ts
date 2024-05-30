import { ExegesisContext } from "exegesis-express";
import allWhereQueries, * as helperScripts from "../helperScripts";
import sequelize from "../../models";
import * as types from "../../types";
import { Op } from "sequelize";
import edrCommonParams from "../params";
import makeQueryValidationError from "../../../components/makeValidationError";

const collectionHourly2024_QueryInterface = async (
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
        true
      ),
      "station",
      "name",
      "date",
      "country",
      "adm0",
      "subregion",
      ...(await helperScripts.includeColumnsToRetrieve(
        ctx,
        matchedCollection.edrVariables
      )),
    ],
    where: await allWhereQueries(
      ctx,
      matchedCollection.geomColumnName,
      matchedCollection.datetimeColumns,
      matchedCollection.pkeyColumn
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

export default collectionHourly2024_QueryInterface;
