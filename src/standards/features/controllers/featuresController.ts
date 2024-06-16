import { ExegesisContext } from "exegesis-express";
import sequelize from "../models";
import parseDbResToGeoJson from "../components/parsedbResToGeoJson";
import { F_AssociatedType, RawGeoDataResult } from "../../../types";

import initCommonQueryParams from "../../components/params";
import {
  genFeature,
  genFeatureCollection,
} from "../components/generateJsonDocs";
import { allowed_F_values } from "..";

import { Op, Sequelize } from "sequelize";
import * as crsDetails from "../../components/crsdetails";
import convertJsonToYAML from "../../components/convertToYaml";

async function queryAllItems(ctx: ExegesisContext) {
  const { contentcrsHeader, f } = await initCommonQueryParams(ctx);

  const dbResponse = await dbQueryMountains(ctx, "name", "mountains", "geom");

  //Parse the dbresult to geojson
  //TODO: Find alternatives or find a sureway method using ST_asGeoJSOn to reduce latency

  //This is also to increase type safety

  const _fcDoc = await genFeatureCollection(
    ctx,
    dbResponse.newFeaturesArray,
    dbResponse.count,
    allowed_F_values
  );
  switch (f.f) {
    case "GEOJSON":
      ctx.res
        .status(200)
        .set("content-type", f.contentType)
        .set("content-crs", contentcrsHeader)
        .setBody(_fcDoc)
        .end();
      break;
    case "YAML":
      ctx.res
        .status(200)
        .set("content-crs", contentcrsHeader)
        .set("content-type", f.contentType)
        .setBody(await convertJsonToYAML(_fcDoc))
        .end();
      break;
    default:
      ctx.res.status(400).setBody(
        ctx.makeValidationError("Unsupported content-type", {
          in: "query",
          name: "f",
          docPath: ctx.api.pathItemptr,
        })
      );
  }
}

async function querySpecificItem(ctx: ExegesisContext) {
  let { f, contentcrsHeader } = await initCommonQueryParams(ctx);
  const _geojsonF_array = await dbQueryMountains(
    ctx,
    "name",
    "mountains",
    "geom"
  );
  if (_geojsonF_array.count < 1) {
    ctx.res.status(404).json({
      requested_featureId: ctx.params.path.featureId,
      status: "Not found",
    });
  } else {
    switch (f.f) {
      case "GEOJSON":
        ctx.res
          .status(200)
          .set("content-crs", contentcrsHeader)
          .set("content-type", f.contentType)
          .setBody(
            await genFeature(
              ctx,
              _geojsonF_array.newFeaturesArray[0],
              allowed_F_values
            )
          );
        break;
      case "YAML":
        ctx.res
          .status(200)
          .set("content-type", f.contentType)
          .setBody(
            await convertJsonToYAML(
              await genFeature(
                ctx,
                _geojsonF_array.newFeaturesArray[0],
                allowed_F_values
              )
            )
          );
        break;
      default:
        ctx.res.status(400).setBody("Unsupported content-type");
    }
  }
}
async function dbQueryMountains(
  ctx: ExegesisContext,
  featureId: string,
  modelName: string,
  geomColumnName: string
) {
  //Initialize common parameters to be used
  const { bboxcrs, crs, limit, offset, xyAxisBbox, zAxisBbox } =
    await initCommonQueryParams(ctx);

  //retrive a specific item
  const featureIdQuery = ctx.params.path.featureId
    ? { [featureId]: ctx.params.path.featureId }
    : undefined;
  //bboxQuery
  const bboxQuery = ctx.params.query.bbox
    ? //reqBboxcrs.uri === crs84hUri  &&
      ctx.params.query.bbox.length > 4
      ? Sequelize.where(
          Sequelize.fn(
            "ST_Intersects",
            Sequelize.col(geomColumnName),
            Sequelize.fn(
              "ST_MakeEnvelope",
              xyAxisBbox[0],
              xyAxisBbox[1],
              xyAxisBbox[2],
              xyAxisBbox[3],
              bboxcrs.srid
            )
          ),
          true
        )
      : Sequelize.where(
          Sequelize.fn(
            "ST_Intersects",
            Sequelize.col(geomColumnName),
            Sequelize.fn("ST_MakeEnvelope", ...xyAxisBbox, bboxcrs.srid)
          ),
          true
        )
    : undefined;

  //Height Query
  const heightQuery =
    ctx.params.query["bbox-crs"] === crsDetails.crs84hUri &&
    ctx.params.query.bbox.length > 4
      ? {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("ST_Z", Sequelize.col(geomColumnName)),
              Op.between,
              zAxisBbox
            ),
          ],
        }
      : undefined;

  //@ts-ignore
  const dbResponse = await sequelize.models[modelName].findAndCountAll({
    attributes: {
      //Remove table geometry column because the geometry returned will be processed further
      exclude: [geomColumnName],

      //Shape the geometries returned
      include: [
        /**
         * @param reqCrs.uri === CRS84h is intended for collections with z-axis
         * If CRS84, return as is
         */
        crs.crs === crsDetails.crs84hUri
          ? [Sequelize.col(geomColumnName), geomColumnName]
          : //Otherwise if its not crs84h, start the next conditional checks
          crs.isGeographic === true
          ? //If requested crs is geographic, Flipthe coords which have been transformed but first forced to a 2D dimensional space
            [
              Sequelize.fn(
                "ST_FlipCoordinates",
                Sequelize.fn(
                  "ST_Transform",
                  Sequelize.fn("ST_Force2D", Sequelize.col(geomColumnName)),
                  crs.srid
                )
              ),
              "geom",
            ]
          : //If the requested crs is not geographic, force it force the data to 2D and transform the result
            //But do not fliptheCoords
            [
              Sequelize.fn(
                "ST_Transform",
                Sequelize.fn("ST_Force2D", Sequelize.col(geomColumnName)),
                crs.srid
              ),
              geomColumnName,
            ],
        ///[Sequelize.fn('ST_Transform',Sequelize.fn('ST_Force2D',Sequelize.col(geomColumnName),reqCrs.srid)),geomColumnName]
      ],
    },
    where: {
      [Op.and]: [
        {
          [geomColumnName]: {
            [Op.ne]: null,
          },
        },
        featureIdQuery,
        bboxQuery,
        heightQuery,
      ],
    },
    order: [[featureId, "ASC"]],
    raw: true,
    offset: offset,
    limit: limit,

    //@ts-expect-error
    includeIgnoreAttributes: false, //Remove artifacts generated by sequelize. Useful for complex models which have joins
  });
  return await parseDbResToGeoJson(dbResponse, "geom", "name");
}

export { queryAllItems, querySpecificItem };
