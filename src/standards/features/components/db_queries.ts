import { Sequelize } from "sequelize";
import sequelize from "../models"; //Do not import the main db connection because the required models have not been init
type ExtentBbox_crs84 = [number, number, number, number][];
type ExtentBbox_crs84H = [number, number, number, number, number, number][];


/**
 * @function ST_hasZ is not available from postgis v3.5^
 * Can be used to run specific queries for CRS84 & CRS84 depending on @flag hasZ
 */
async function querySpatialExtent(
  modelname: string,
  bboxgenScope: string
): Promise<ExtentBbox_crs84 | ExtentBbox_crs84H> {
  try {
    const result: { [key: string]: any } = await sequelize.models[modelname]
      .scope(bboxgenScope)
      //Use findOne to return an object Instead of array
      .findOne({ raw: true });
    return [[...Object.values(result)]] as ExtentBbox_crs84 | ExtentBbox_crs84H;

  } catch (err) {
    console.log(err)
    throw new Error(`Error in bbox generation function: ${__filename}`);
  }
}
async function queryTemporalIntervals(
  modelName: string,
  dateTimeColumns: string[] | null
): Promise<[number, number][] | [null, null][]> {
  const intervals: [number, number][] | [null, null][] = [];
  if (!dateTimeColumns) {
    intervals.push([null, null]);
  } else {
    for (const column of dateTimeColumns) {
      let min = await sequelize.models[modelName].min(column);
      let max = await sequelize.models[modelName].max(column);
      intervals.push([min as any, max as any]);
    }
  }
  return intervals;
}

export { querySpatialExtent,queryTemporalIntervals };
