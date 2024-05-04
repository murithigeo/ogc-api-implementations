"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const parsedbResToGeoJson_1 = __importDefault(require("../components/parsedbResToGeoJson"));
const params_1 = __importDefault(require("../components/params"));
const generateJsonDocs_1 = require("../components/generateJsonDocs");
const __1 = require("..");
const sequelize_1 = require("sequelize");
const __2 = require("../");
const convertToYaml_1 = __importDefault(require("../components/convertToYaml"));
exports.getItems = async function (context) {
    const { contentcrsHeader, f } = await (0, params_1.default)(context);
    const dbResponse = await dbQueryMountains(context, "name", "mountains", "geom");
    //Parse the dbresult to geojson
    //TODO: Find alternatives or find a sureway method using ST_asGeoJSOn to reduce latency
    //This is also to increase type safety
    const _fcDoc = await (0, generateJsonDocs_1.genFeatureCollection)(context, dbResponse.newFeaturesArray, dbResponse.count, __1.allowed_F_values);
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
                .setBody(await (0, convertToYaml_1.default)(_fcDoc))
                .end();
            break;
        default:
            context.res.status(400).setBody(context.makeValidationError("Unsupported content-type", {
                in: "query",
                name: "f",
                docPath: context.api.pathItemptr,
            }));
    }
};
exports.getItem = async function (context) {
    const { f, contentcrsHeader } = await (0, params_1.default)(context);
    const _geojsonF_array = await dbQueryMountains(context, "name", "mountains", "geom");
    if (_geojsonF_array.count < 1) {
        context.res.status(404).json({
            requested_featureId: context.params.path.featureId,
            status: "Not found",
        });
    }
    else {
        switch (f) {
            case "json":
                context.res
                    .status(200)
                    .set("content-crs", contentcrsHeader)
                    .set("content-type", "application/geo+json")
                    .setBody(await (0, generateJsonDocs_1.genFeature)(context, _geojsonF_array.newFeaturesArray[0], __1.allowed_F_values));
                break;
            case "yaml":
                context.res
                    .status(200)
                    .set("content-type", "text/yaml")
                    .setBody(await (0, convertToYaml_1.default)(await (0, generateJsonDocs_1.genFeature)(context, _geojsonF_array.newFeaturesArray[0], __1.allowed_F_values)));
                break;
            default:
                context.res.status(400).setBody("Unsupported content-type");
        }
    }
};
async function dbQueryMountains(context, featureId, modelName, geomColumnName) {
    //Initialize common parameters to be used
    const { reqCrs, reqBboxcrs, limit, offset, bboxArray } = await (0, params_1.default)(context);
    //retrive a specific item
    const featureIdQuery = context.params.path.featureId
        ? { [featureId]: context.params.path.featureId }
        : undefined;
    //bboxQuery
    const bboxQuery = context.params.query.bbox
        ? //reqBboxcrs.uri === crs84hUri  &&
            context.params.query.bbox.length > 4
                ? sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("ST_Intersects", sequelize_1.Sequelize.col(geomColumnName), sequelize_1.Sequelize.fn("ST_MakeEnvelope", bboxArray[0], bboxArray[1], bboxArray[3], bboxArray[4], reqBboxcrs.srid)), true)
                : sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("ST_Intersects", sequelize_1.Sequelize.col(geomColumnName), sequelize_1.Sequelize.fn("ST_MakeEnvelope", ...bboxArray, reqBboxcrs.srid)), true)
        : undefined;
    //Height Query
    const heightQuery = context.params.query["bbox-crs"] === __2.crs84hUri && context.params.query.bbox.length > 4
        ? {
            [sequelize_1.Op.and]: [
                sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("ST_Z", sequelize_1.Sequelize.col(geomColumnName)), sequelize_1.Op.gte, bboxArray[2]),
                sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("ST_Z", sequelize_1.Sequelize.col(geomColumnName)), sequelize_1.Op.lte, bboxArray[5]),
            ],
        }
        : undefined;
    //@ts-ignore
    const dbResponse = await models_1.default.models[modelName].findAndCountAll({
        attributes: {
            //Remove table geometry column because the geometry returned will be processed further
            exclude: [geomColumnName],
            //Shape the geometries returned
            include: [
                /**
                 * @param reqCrs.uri === CRS84h is intended for collections with z-axis
                 * If CRS84, return as is
                 */
                reqCrs.uri === __2.crs84hUri
                    ? [sequelize_1.Sequelize.col(geomColumnName), geomColumnName]
                    : //Otherwise if its not crs84h, start the next conditional checks
                        reqCrs.isGeographic === true
                            ? //If requested crs is geographic, Flipthe coords which have been transformed but first forced to a 2D dimensional space
                                [
                                    sequelize_1.Sequelize.fn("ST_FlipCoordinates", sequelize_1.Sequelize.fn("ST_Transform", sequelize_1.Sequelize.fn("ST_Force2D", sequelize_1.Sequelize.col(geomColumnName)), reqCrs.srid)),
                                    "geom",
                                ]
                            : //If the requested crs is not geographic, force it force the data to 2D and transform the result
                                //But do not fliptheCoords
                                [
                                    sequelize_1.Sequelize.fn("ST_Transform", sequelize_1.Sequelize.fn("ST_Force2D", sequelize_1.Sequelize.col(geomColumnName)), reqCrs.srid),
                                    geomColumnName,
                                ],
                ///[Sequelize.fn('ST_Transform',Sequelize.fn('ST_Force2D',Sequelize.col(geomColumnName),reqCrs.srid)),geomColumnName]
            ],
        },
        where: {
            [sequelize_1.Op.and]: [
                {
                    [geomColumnName]: {
                        [sequelize_1.Op.ne]: null,
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
    return await (0, parsedbResToGeoJson_1.default)(dbResponse, "geom", "name");
}
