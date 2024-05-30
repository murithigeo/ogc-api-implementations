import { _allCrsProperties } from "../../components/crsdetails";
import { ExegesisContext } from "exegesis-express";
import * as types from "../types";
import { Op, ProjectionAlias, Sequelize, WhereOptions, col } from "sequelize";
import edrCommonParams from "./params";
import unitConverter from "convert";

export const instanceIdColumnQuery = async (
  ctx: ExegesisContext
): Promise<WhereOptions<any>> =>
  !ctx.params.path.instanceId
    ? undefined
    : {
        [ctx.params.query.instancemode]: {
          [Op.eq]: ctx.params.path.instanceId,
        },
      };

export const itemIdQuery = async (ctx: ExegesisContext, pkeyColumn: string) => {
  const { itemId } = await edrCommonParams(ctx);
  return itemId
    ? {
        [pkeyColumn]: itemId,
      }
    : undefined;
};
//export { instanceIdStation };

export const matchCrsUriToProps = async (
  crsStrings: string[]
): Promise<types.Crs_Details> =>
  _allCrsProperties
    .filter((obj) => crsStrings.some((string) => obj.crs.includes(string)))
    .map((crsProp) => ({ crs: crsProp.crs, wkt: crsProp.wkt }));

export const xyBboxQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string
) => {
  const coreParams = await edrCommonParams(ctx);
  return ctx.params.query.bbox
    ? Sequelize.where(
        Sequelize.fn(
          "ST_Intersects",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857),
          Sequelize.fn(
            "ST_Transform",
            Sequelize.fn(
              "ST_MakeEnvelope",
              Sequelize.literal(coreParams.xyAxisBbox.join(",")),
              coreParams.bboxcrs.srid
            ),
            3857
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
    ? Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857)
        ),
        Op.between,
        (await edrCommonParams(ctx)).zAxisBbox
      )
    : undefined;

/**
 *
 * @param ctx
 * @param geomColumnName
 * @param resWithZaxis If table has zAxis geometry, toggle whether the res has a zAxis
 * @returns
 */
export const transformToCrsOrForce2DQuery = async (
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
  const pNamesParam = (await edrCommonParams(ctx)).parameter_names;
  const pNames =
    pNamesParam === undefined
      ? edrVariables.map((variable) => variable.id)
      : pNamesParam.length < 1
      ? edrVariables.map((variable) => variable.id)
      : pNamesParam;

  const columnsToRetrieve = edrVariables
    .filter((variable) => pNames.includes(variable.id))
    .map((variable) => variable.columnDerivedFrom);
  return columnsToRetrieve;
};

export const cubeZQuery = async (ctx: ExegesisContext) => {
  const { z } = await edrCommonParams(ctx);
  //const h = unit;
};

export const locationIdQuery = async (ctx: ExegesisContext) => {
  const { locationId } = await edrCommonParams(ctx);
  return locationId
    ? {
        [Op.or]: [
          { station: locationId.toUpperCase() },
          { name: { [Op.like]: "%" + locationId.toUpperCase() + "%" } },
        ],
      }
    : undefined;
};

export const nonNullGeometryFilter = async (geomColumnName: string) => {
  return {
    [geomColumnName]: {
      [Op.ne]: null,
    },
  };
};

export const radiusCoordsQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string
) => {
  const { within, within_units, coords, _url, crs } = await edrCommonParams(
    ctx
  );
  return ctx.params.query.within && _url.pathname.endsWith("radius")
    ? Sequelize.where(
        Sequelize.fn(
          "ST_DistanceSphere",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857),
          Sequelize.fn("ST_GeomFromText", coords.coords2d, 3857)
        ),
        "<=",
        unitConverter(within, within_units).to("meter")
      )
    : undefined;
};

export const positionCoordsQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string,
  coordsSearchPrecision: number
) => {
  const { coords, _url, crs } = await edrCommonParams(ctx);
  return ctx.params.query.coords && _url.pathname.endsWith("position")
    ? Sequelize.where(
        Sequelize.fn(
          "ST_DWithin",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857),
          Sequelize.fn("ST_GeomFromText", coords.coords2d,3857),
          coordsSearchPrecision
        ),
        true
      )
    : undefined;
};

const areaCoordsQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string
) => {
  const { crs, coords, _url } = await edrCommonParams(ctx);
  return coords && _url.pathname.endsWith("area")
    ? Sequelize.where(
        Sequelize.fn(
          "ST_Intersects",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857),
          Sequelize.fn("ST_GeomFromText", coords.coords2d, 3857)
        ),
        true
      )
    : undefined;
};

const trajectoryCoordsQuery = async (
  ctx: ExegesisContext,
  geomColumnName: string,
  datetimeColumns: string[]
) => {
  const {
    _url,
    coords,
    crs,
    corridor_height,
    corridor_width,
    width_units,
    height_units,
  } = await edrCommonParams(ctx);

  return coords &&
    (_url.pathname.endsWith("trajectory") || _url.pathname.endsWith("corridor"))
    ? {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              "ST_DWithin",
              Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857),
              Sequelize.fn("ST_GeomFromText", coords.coords2d, 3857),
              corridor_width
                ? unitConverter(corridor_width, width_units).to("m")
                : 30
            ),
            true
          ),
          coords.mmin //Just one check because in precontroller validation, it wont accept multidimensional...
            ? {
                [Op.or]: datetimeColumns.map((column) =>
                  Sequelize.where(Sequelize.col(column), Op.between, [
                    coords.mmin,
                    coords.mmax,
                  ])
                ),
              }
            : undefined,
          coords.zmin
            ? {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.fn(
                      "ST_Z",
                      Sequelize.fn(
                        "ST_Transform",
                        Sequelize.col(geomColumnName),
                        3857
                      )
                    ),
                    Op.between,
                    [coords.zmin, coords.zmax]
                  ),
                ],
              }
            : undefined,
          corridor_height
            ? Sequelize.where(
                Sequelize.fn(
                  "ST_Z",
                  Sequelize.fn(
                    "ST_Transform",
                    Sequelize.col(geomColumnName),
                    3857
                  )
                ),
                Op.lte,
                unitConverter(corridor_height, height_units).to("meter")
              )
            : undefined,
        ],
      }
    : undefined;
};

export const zQuery = async (ctx: ExegesisContext, geomColumnName: string) => {
  const { z } = await edrCommonParams(ctx);
  let whereClause: WhereOptions;
  if (z) {
    if (z.in) {
      return (whereClause = Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857)
        ),
        Op.in,
        //[...z.in]
        Sequelize.literal(`(${z.in})`)
      ));
    }
    if (z.min && z.max) {
      return (whereClause = Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857)
        ),
        Op.between,
        [z.min, z.max]
      ));
    }
    if (z.one) {
      return (whereClause = Sequelize.where(
        Sequelize.fn(
          "ST_Z",
          Sequelize.fn("ST_Transform", Sequelize.col(geomColumnName), 3857)
        ),
        Op.eq,
        z.one
      ));
    }
  }
};
export const dateTimeQuery = async (
  ctx: ExegesisContext,
  datetimeColumns: string[]
) => {
  const datetime = (await edrCommonParams(ctx)).datetime;

  let whereClause: WhereOptions | undefined = undefined;
  if (ctx.params.query.datetime) {
    if (datetime.one) {
      whereClause = {
        [Op.or]: datetimeColumns.map((column) => ({ [column]: datetime.one })),
      };
    } else if (datetime.start && datetime.end) {
      whereClause = {
        [Op.or]: datetimeColumns.map((column) => [
          Sequelize.where(Sequelize.col(column), Op.gte, datetime.start),
          Sequelize.where(Sequelize.col(column), Op.lte, datetime.end),
        ]),
      };
    } else if (!datetime.start && datetime.end) {
      whereClause = datetimeColumns.map((column) =>
        Sequelize.where(Sequelize.col(column), Op.lte, datetime.end)
      );
    } else {
      whereClause = datetimeColumns.map((column) =>
        Sequelize.where(Sequelize.col(column), Op.gte, datetime.start)
      );
    }
    return whereClause;
  }
  //return ctx.params.query.datetime?
};

const allWhereQueries = async (
  ctx: ExegesisContext,
  geomColumnName: string,
  datetimeColumns: string[],
  pKeyColumn: string,
  coordsSearchPrecision?: number
): Promise<WhereOptions<any>> => {
  return {
    [Op.and]: [
      await nonNullGeometryFilter(geomColumnName),
      await instanceIdColumnQuery(ctx),
      await xyBboxQuery(ctx, geomColumnName),
      await zAxisBboxQuery(ctx, geomColumnName),
      await locationIdQuery(ctx),
      await positionCoordsQuery(
        ctx,
        geomColumnName,
        coordsSearchPrecision ?? 0.0001
      ),
      await radiusCoordsQuery(ctx, geomColumnName),
      await dateTimeQuery(ctx, datetimeColumns),
      await areaCoordsQuery(ctx, geomColumnName),
      await trajectoryCoordsQuery(ctx, geomColumnName, datetimeColumns),
      await zQuery(ctx, geomColumnName),
      await itemIdQuery(ctx, pKeyColumn),
      //await cubeZQuery(ctx),
      //await includeColumnsToRetrieve(ctx, edrVariables),
      //await transformToCrsOrForce2DQuery(ctx, geomColumnName, resultWithZAxis),
    ],
  };
};

export default allWhereQueries;
