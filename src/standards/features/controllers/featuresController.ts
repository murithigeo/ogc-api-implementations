import { ExegesisContext } from "exegesis-express";
import sequelize from "../models";
import { httpMessages } from "../../../httpMessages";
import parseDbResToGeoJson from "../components/parsedbResToGeoJson";
import { F_AssociatedType, RawGeoDataResult } from "../../../types";

import initCommonQueryParams from "../components/params";
import {
  genFeature,
  genFeatureCollection,
} from "../components/generateJsonDocs";
import { allowed_F_values } from "..";
import { genLinksAll } from "../components/links";
import { ReadableStream } from "stream/web";
import { Op, Sequelize } from "sequelize";
import { crs84Uri, crs84hUri } from "../";
import convertJsonToYAML from "../components/convertToYaml";

exports.getItems = async function (context: ExegesisContext) {
  const { contentcrsHeader, f } = await initCommonQueryParams(context);

  const dbResponse = await dbQueryMountains(
    context,
    "name",
    "mountains",
    "geom"
  );

  //Parse the dbresult to geojson
  //TODO: Find alternatives or find a sureway method using ST_asGeoJSOn to reduce latency

  //This is also to increase type safety

  const _fcDoc = await genFeatureCollection(
    context,
    dbResponse.newFeaturesArray,
    dbResponse.count,
    allowed_F_values
  );
  switch (f) {
    case "json":
      context.res
        .status(200)
        .set("content-type", "application/geo+json")
        .set("content-crs", contentcrsHeader)
        .setBody(_fcDoc)
        .end();
      break;
    case "yaml":
      context.res
        .status(200)
        .set("content-crs", contentcrsHeader)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_fcDoc))
        .end();
      break;
    default:
      context.res.status(400).setBody(
        context.makeValidationError("Unsupported content-type", {
          in: "query",
          name: "f",
          docPath: context.api.pathItemptr,
        })
      );
  }
};

exports.getItem = async function (context: ExegesisContext) {
  const { f, contentcrsHeader } = await initCommonQueryParams(context);
  const _geojsonF_array = await dbQueryMountains(
    context,
    "name",
    "mountains",
    "geom"
  );
  if (_geojsonF_array.count < 1) {
    context.res.status(404).json({
      requested_featureId: context.params.path.featureId,
      status: "Not found",
    });
  } else {
    switch (f) {
      case "json":
        context.res
          .status(200)
          .set("content-crs", contentcrsHeader)
          .set("content-type", "application/geo+json")
          .setBody(
            await genFeature(
              context,
              _geojsonF_array.newFeaturesArray[0],
              allowed_F_values
            )
          );
        break;
      case "yaml":
        context.res
          .status(200)
          .set("content-type", "text/yaml")
          .setBody(
            await convertJsonToYAML(
              await genFeature(
                context,
                _geojsonF_array.newFeaturesArray[0],
                allowed_F_values
              )
            )
          );
        break;
      default:
        context.res.status(400).setBody("Unsupported content-type");
    }
  }
};
async function dbQueryMountains(
  context: ExegesisContext,
  featureId: string,
  modelName: string,
  geomColumnName: string
) {
  //Initialize common parameters to be used
  const { reqCrs, reqBboxcrs, limit, offset, bboxArray } =
    await initCommonQueryParams(context);

  //retrive a specific item
  const featureIdQuery = context.params.path.featureId
    ? { [featureId]: context.params.path.featureId }
    : undefined;
  //bboxQuery
  const bboxQuery = context.params.query.bbox
    ? reqBboxcrs.uri === crs84hUri
      ? Sequelize.where(
          Sequelize.fn(
            "ST_Intersects",
            Sequelize.col(geomColumnName),
            Sequelize.fn(
              "ST_MakeEnvelope",
              bboxArray[0],
              bboxArray[1],
              bboxArray[3],
              bboxArray[4],
              reqBboxcrs.srid
            )
          ),
          true
        )
      : Sequelize.where(
          Sequelize.fn(
            "ST_Intersects",
            Sequelize.col(geomColumnName),
            Sequelize.fn("ST_MakeEnvelope", ...bboxArray, reqBboxcrs.srid)
          ),
          true
        )
    : undefined;

  //Height Query
  const heightQuery =
    context.params.query["bbox-crs"] === crs84hUri && context.params.query.bbox
      ? {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("ST_Z", Sequelize.col(geomColumnName)),
              Op.gte,
              bboxArray[2]
            ),
            Sequelize.where(
              Sequelize.fn("ST_Z", Sequelize.col(geomColumnName)),
              Op.lte,
              bboxArray[5]
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
        reqCrs.uri === crs84hUri
          ? [Sequelize.col(geomColumnName), geomColumnName]
          : //Otherwise if its not crs84h, start the next conditional checks
          reqCrs.isGeographic === true
          ? //If requested crs is geographic, Flipthe coords which have been transformed but first forced to a 2D dimensional space
            [
              Sequelize.fn(
                "ST_FlipCoordinates",
                Sequelize.fn(
                  "ST_Transform",
                  Sequelize.fn("ST_Force2D", Sequelize.col(geomColumnName)),
                  reqCrs.srid
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
                reqCrs.srid
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
