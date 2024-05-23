import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import sequelize from "../../models";
import return500InternalServerErr from "../../../components/makeInternalServerError";
import { Op } from "sequelize";
import * as units from '../weatherMetadata/units'
async function genExtentBbox(
  ctx: ExegesisContext,
  modelName: string
): Promise<[number, number, number, number, number?, number?]> {
  try {
    const res = (
      (await sequelize.models[modelName].scope("bboxGen").findOne({
        where: {
          [Op.and]: [instanceIdQuery(ctx)],
        },
        //includeIgnoreAtri
        raw: true,
      })) as any
    ).bbox;
    //console.log(res);
    //console.log(res);
    return res;
  } catch (err) {
    ctx.res.status(500).json(await return500InternalServerErr(ctx));
  }
}

const instanceIdQuery = (ctx: ExegesisContext) =>
  ctx.params.path.instanceId
    ? { station: ctx.params.path.instanceId }
    : undefined;

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
        where: { [Op.and]: [instanceIdQuery(ctx)] },
      });
      let max = await sequelize.models[modelName].max(column);
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
  //Instantiate extent_bbox
  let _extent_bbox: [number, number, number, number, number?, number?][];
  try {
    _extent_bbox = [await genExtentBbox(ctx, collectionConfig.modelName)];
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

  let parameterNames: types.Parameter_Names = {};

  for (const parameter of collectionConfig.edrVariables) {
    parameterNames[parameter.id] = {
      type: "Parameter",
      id: parameter.id,
      description: parameter.id + "parameter",
      "data-type": parameter.dataType,
      unit: units[parameter.unit],
      observedProperty: units[parameter.name]
    };

  }
  //Instantiate parameterNames
  console.log(parameterNames)
  return {
    id: collectionConfig.id,
    crs: [],
    output_formats: [],
    title: collectionConfig.id + " collection",
    data_queries,
    extent: {
      spatial: {
        bbox: _extent_bbox,
        crs: "CRS84",
      },
      temporal: {
        interval: tempInterval,
        trs: isUTC ? "UTC" : "Gregorian",
      },
      vertical:
        zMin !== 0 && zMax !== 0
          ? {
              name: "CRS84h",
              interval: [[zMin, zMax]],
              vrs: "Ellipsoidal height",
            }
          : undefined,
    },
    parameter_names: parameterNames,
    //If extent[2] && extent[5] =0, then no vertical
  };
}

export { genCollectionInfo };
