/**
 * @description Use this file to generate model specific queries
 */

import { Sequelize } from "sequelize";
import getPostGisVersion from "./postgis_version";

const subqueryToUseBbox = (hasZflag: boolean, hasZ: boolean) => hasZflag;
export default async function edrModelScopes(sequelize: Sequelize) {
  const postgisVersion = await getPostGisVersion(sequelize);

  let hasZflag: boolean = false,
    hasMflag: boolean = false,
    hasZaxis: boolean= false;
  //postgisVersion<3.5?hasMflag=false && hasMflag=false:
  if (postgisVersion >= 3.5) {
    hasZflag = true;
    hasMflag = true;
  }
  /**
   * Generic Sequelize functions
   *
   */

  sequelize.models.daily.addScope("bboxGen", {
    attributes: {
      include: [
        [
          Sequelize.literal(
            `SELECT ARRAY[ST_XMin(bbox),ST_Ymin(bbox),ST_ZMin(bbox),ST_Xmax(bbox),ST_Ymax(bbox),ST_Zmax(bbox)]
            FROM (SELECT ST_3DExtent(geom) as bbox FROM ${sequelize.models.daily.tableName})`
          ),
          "bbox",
        ],
      ],
    },
  });
  //model

  return sequelize;
}
