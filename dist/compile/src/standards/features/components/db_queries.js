"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryTemporalIntervals = exports.querySpatialExtent = void 0;
const models_1 = __importDefault(require("../models")); //Do not import the main db connection because the required models have not been init
/**
 * @function ST_hasZ is not available from postgis v3.5^
 * Can be used to run specific queries for CRS84 & CRS84 depending on @flag hasZ
 */
async function querySpatialExtent(modelname, bboxgenScope) {
    try {
        const result = await models_1.default.models[modelname]
            .scope(bboxgenScope)
            //Use findOne to return an object Instead of array
            .findOne({ raw: true });
        return [[...Object.values(result)]];
    }
    catch (err) {
        console.log(err);
        throw new Error(`Error in bbox generation function: ${__filename}`);
    }
}
exports.querySpatialExtent = querySpatialExtent;
async function queryTemporalIntervals(modelName, dateTimeColumns) {
    const intervals = [];
    if (!dateTimeColumns) {
        intervals.push([null, null]);
    }
    else {
        for (const column of dateTimeColumns) {
            let min = await models_1.default.models[modelName].min(column);
            let max = await models_1.default.models[modelName].max(column);
            intervals.push([min, max]);
        }
    }
    return intervals;
}
exports.queryTemporalIntervals = queryTemporalIntervals;
