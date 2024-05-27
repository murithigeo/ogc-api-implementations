import { _allCrsProperties } from "../../components/crsdetails";
import { ExegesisContext } from "exegesis-express";
import * as types from "../types";
import { Op, ProjectionAlias, Sequelize } from "sequelize";
import edrCommonParams from "./params";
import unitConverter from "convert";



export const instanceIdColumnQuery = (ctx: ExegesisContext) =>
  !ctx.params.path.instanceId
    ? undefined
    : {
        [ctx.params.query.instancemode]: {
          [Op.eq]: ctx.params.path.instanceId,
        },
      };

//export { instanceIdStation };

export const matchCrsUriToProps = async (
  crsStrings: string[]
): Promise<types.Crs_Details> => {
  return _allCrsProperties
    .filter((obj) => crsStrings.some((string) => obj.crs.includes(string)))
    .map((crsProp) => ({ crs: crsProp.crs, wkt: crsProp.wkt }));
};

export const xyBboxQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string
) => {
  const coreParams = await edrCommonParams(ctx);
  return ctx.params.query.bbox
    ? Sequelize.where(
        Sequelize.fn(
          "ST_Intersects",
          Sequelize.col(geomColumnName),
          Sequelize.fn(
            "ST_MakeEnvelope",
            Sequelize.literal(coreParams.xyAxisBbox.join(",")),
            coreParams.bboxcrs.srid
          )
        ),
        true
      )
    : undefined;
};

export const zAxisBboxQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string
) =>
  ctx.params.query.bbox && ctx.params.query.bbox.length > 4
    ? {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("ST_Z", Sequelize.col(geomColumnName)),
            Op.gte,
            (await edrCommonParams(ctx)).zAxisBbox[0]
          ),
          Sequelize.where(
            Sequelize.fn("ST_Z", Sequelize.col(geomColumnName)),
            Op.lte,
            (await edrCommonParams(ctx)).zAxisBbox[1]
          ),
        ],
      }
    : undefined;

/**
 *
 * @param ctx
 * @param geomColumnName
 * @param resWithZaxis If table has zAxis geometry, toggle whether the res has a zAxis
 * @returns
 */
export const nonJoinTableCrsProcessing = async (
  ctx: ExegesisContext,
  geomColumnName: string,
  resWithZaxis: boolean
): Promise<ProjectionAlias> => {
  const crs = (await edrCommonParams(ctx)).crs;
  const reusable = Sequelize.fn(
    "ST_Transform",
    Sequelize.col(geomColumnName),
    crs.srid
  );
  if (resWithZaxis) {
    if (crs.isGeographic) {
      return [Sequelize.fn("ST_FlipCoordinates", reusable), geomColumnName];
    }
    return [reusable, geomColumnName];
  } else {
    if (crs.isGeographic) {
      return [
        Sequelize.fn(
          "ST_FlipCoordinates",
          Sequelize.fn("ST_Force2D", reusable)
        ),
        geomColumnName,
      ];
    }
    return [Sequelize.fn("ST_Force2D", reusable), geomColumnName];
  }
};

/**
 *
 * @param ctx
 * @param edrVariables
 * @returns an array of columns to retrieve from the database
 */
export const includeColumnsToRetrieve = async (
  ctx: ExegesisContext,
  edrVariables: types.collectionConfigEdrVariable[]
) => {
  const pNames = (await edrCommonParams(ctx)).parameter_names;

  const array = ctx.params.query["parameter-name"]
    ? edrVariables
        .filter((variable) => pNames.includes(variable.id))
        .map((variable) => variable.columnDerivedFrom)
    : undefined;
  return array;
};

export const cubeZQuery = async (ctx: ExegesisContext) => {
  const { z } = await edrCommonParams(ctx);
  //const h = unit;
};
