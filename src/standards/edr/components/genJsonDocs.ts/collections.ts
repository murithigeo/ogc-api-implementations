import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import sequelize from "../../models";
import return500InternalServerErr from "../../../components/makeInternalServerError";
import { Op } from "sequelize";
import allWhereQueries, * as helperScripts from "../helperScripts";
import * as DataQueries from "../links/queryTypes";
import * as crsDetails from "../../../components/crsdetails";
import genParamNameObj from "../collection_instanceParamNamesObject";

async function genExtentBbox(
  ctx: ExegesisContext,
  modelName: string,
  geomColumnName: string
): Promise<[number, number, number, number, number?, number?]> {
  try {
    const res = (
      (await sequelize.models[modelName].scope("bboxGen").findOne({
        where: await helperScripts.instanceIdColumnQuery(ctx),
        //includeIgnoreAtri
        raw: true,
      })) as any
    ).bbox;
    //console.log(res);
    return res;
  } catch (err) {
    ctx.res.status(500).json(await return500InternalServerErr(ctx));
  }
}

async function genExtentTempInterval(
  ctx: ExegesisContext,
  modelName: string,
  datetimeColumns?: string[]
) {
  //Instantiate temporal interval array
  const intervals: [string | null, string | null][] = [];

  //If the datecolumns are listed, then query the database
  if (datetimeColumns.length > 0) {
    for (const column of datetimeColumns) {
      let min = await sequelize.models[modelName].min(column, {
        where: await helperScripts.instanceIdColumnQuery(ctx),
      });
      let max = await sequelize.models[modelName].max(column, {
        where: await helperScripts.instanceIdColumnQuery(ctx),
      });
      intervals.push([min as string, max as string]);
    }
  } else {
    //Push null vals if datetime columns are undefined
    intervals.push([null, null]);
  }

  return intervals;
}

async function genCollectionInfo(
  ctx: ExegesisContext,
  collectionConfig: types.CollectionWithoutProps
): Promise<types.Collection> {
  //Alter the value of instanceId if provided collectionId is not equal to the configuration value
  //Implies that we are querying instances

  /*
  if (collectionConfig.id !== collectionOrInstanceId) {
    ctx.params.path.instanceId = collectionOrInstanceId;
  }
  */

  //Instantiate extent_bbox
  let _extent_bbox: [number, number, number, number, number?, number?][];
  try {
    _extent_bbox = [
      await genExtentBbox(
        ctx,
        collectionConfig.modelName,
        collectionConfig.geomColumnName
      ),
    ];
  } catch (err) {
    ctx.res.status(500).json(await return500InternalServerErr(ctx));
  }

  const tempInterval = await genExtentTempInterval(
    ctx,
    collectionConfig.modelName,
    collectionConfig.datetimeColumns
  );

  let isUTC: boolean = false;
  //Use first array to identify trs. Use CRS if the first interval element has hours
  if (tempInterval[0][0] && new Date(tempInterval[0][0]).getUTCHours() !== 0) {
    isUTC = true;
  }
  //Get zmin & zmax before deletion
  const zMin = _extent_bbox[0][2];
  const zMax = _extent_bbox[0][5];

  _extent_bbox[0].splice(2, 1); //Remove zmin
  _extent_bbox[0].splice(4, 1); //Remove zmax

  const data_queries: types.CollectionDataQueries = {};

  for (const [k, v] of Object.entries(collectionConfig.data_queries)) {
    if (v) {
      data_queries[k] = await DataQueries.default({
        ctx: ctx,
        query_type: k as types.QueryType,
        crsStrings: !v.specificCrs
          ? collectionConfig.allSupportedCrs
          : v.specificCrs,
        default_output_format: !v.specificDefOutputFormat
          ? collectionConfig.default_output_format
          : v.specificDefOutputFormat,
        output_formats: !v.specificOutputFormats
          ? collectionConfig.output_formats
          : v.specificOutputFormats,
        width_units: v.width_units,
        height_units: v.height_units,
        within_units: v.within_units,
      });
    }
  }

  if (ctx.params.path.instanceId && data_queries.instances) {
    delete data_queries.instances;
  }

  return {
    id: !ctx.params.path.instanceId
      ? ctx.params.path.collectionId
      : ctx.params.path.instanceId, //new URL(ctx.api.serverObject.uri+ctx.req.url).pathname.endsWith("instances")||ctx.params.path.instanceId?,
    crs: collectionConfig.allSupportedCrs,
    output_formats: collectionConfig.output_formats,
    title: collectionConfig.id + " collection",
    extent: {
      spatial: {
        bbox: _extent_bbox,
        crs: "CRS84",
      },
      temporal: {
        interval: tempInterval,
        trs: isUTC ? "UTC" : crsDetails.trs,
      },
      vertical:
        zMin !== 0 && zMax !== 0
          ? {
              name: crsDetails.crs84hUri,
              interval: [[zMin, zMax]],
              vrs: "ellipsoidal height",
            }
          : undefined,
    },
    parameter_names: await genParamNameObj(collectionConfig.edrVariables),
    data_queries,
    //If extent[2] && extent[5] =0, then no vertical
  };
}

export { genCollectionInfo };
