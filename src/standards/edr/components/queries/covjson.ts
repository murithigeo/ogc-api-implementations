import { Sequelize } from "sequelize";
import allWhereQueries, * as helperScripts from "../helperScripts";
import * as types from "../../types";
import { ExegesisContext } from "exegesis-express";
import commonParams from "../../../components/params";
import sequelize from "../../models";

const getCovJsonData = async (
  ctx: ExegesisContext,
  matchedCollection: types.CollectionWithoutProps
) => {
  const params = await commonParams(ctx);
  return await sequelize.models[matchedCollection.modelName].findAll({
    raw: true,
    group: matchedCollection.geomColumnName,
    where: await allWhereQueries(
      ctx,
      matchedCollection
    ),
    attributes: [
      //matchedCollection.geomColumnName,
      ...(await helperScripts.includeColumnsToRetrieve(
        ctx,
        matchedCollection.edrVariables,
        "COVERAGEJSON"
      )),
      [
        Sequelize.fn(
          "Array_Agg",
          Sequelize.col(matchedCollection.datetimeColumn)
        ),
        matchedCollection.datetimeColumn,
      ],
      await helperScripts.transformToCrsOrForce2DQuery(
        ctx,
        matchedCollection.geomColumnName,
        //true
      ),
    ],
    limit: params.limit,
    //groupedLimit: params.limit,
    offset: params.offset,
  });
};

export default getCovJsonData;
