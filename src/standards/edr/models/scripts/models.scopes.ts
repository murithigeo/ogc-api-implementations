/**
 * @description Use this file to generate model specific queries
 */

import { Sequelize } from "sequelize";
import getPostGisVersion from "./postgis_version";

const subqueryToUseBbox = (hasZflag: boolean, hasZ: boolean) => hasZflag;
export default async function edrModelScopes(sequelize: Sequelize) {

  sequelize.models.hourly2024.addScope("bboxGen", {
    attributes: [
      [
        Sequelize.literal(
          `ARRAY[
              ST_XMin(ST_3DExtent(geom)),
              ST_YMin(ST_3DExtent(geom)),
              ST_ZMin(ST_3DExtent(geom)),
              ST_XMax(ST_3DExtent(geom)),
              ST_YMax(ST_3DExtent(geom)),
              ST_ZMax(ST_3DExtent(geom))
            ]`
        ),
        "bbox",
      ],
    ],
    //exclude:["id","station","date","source","name","report_type","call_sign","quality_control","wnd","tmp","dew","slp","geom"]
  });
  //model

  return sequelize;
}
