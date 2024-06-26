import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import genParamNameObj from "../collection_instanceParamNamesObject";
import edrCommonParams from "../../../components/params";
import { parseTempCovJSON, parseWindCovJSON } from "../parseWeatherData";
import { Model } from "sequelize";
import { CrsDetail } from "../../../types";

/**
 * @param
 */
async function domainTypeDetermination(
  geomColumnType:
    | "Point"
    | "MultiPoint"
    | "Polyon"
    | "MultiPolyon"
    | "LineString"
    | "Trajectory",
  datetime: string[]
): Promise<types.DomainType> {
  //let datetime: string[] = row[matchedCollection.datetimeColumn];
  //const geomType = geomColumn.type;

  //Change geomColumnType if LineString
  geomColumnType =
    geomColumnType === "LineString" ? "Trajectory" : geomColumnType;

  //Cast to array: Use "," because the char does not exist in timestamp. Update to correct

  //@ts-expect-error
  return datetime.length > 1 && geomColumnType !== "Trajectory"
    ? geomColumnType + `Series`
    : geomColumnType;
}

async function parseAxes(
  domainType: types.DomainType,
  geom: any,
  crs: CrsDetail,
  datetime: string[]
): Promise<types.Axes> {
  const CRS84h = crs.code === "CRS84h";

  return domainType === "PointSeries" || domainType === "Point"
    ? {
        x: {
          values: crs.isGeographic ? geom.coordinates[1] : geom.coordinates[0],
        },
        y: {
          values: crs.isGeographic ? geom.coordinates[0] : geom.coordinates[1],
        },
        z: crs.code === "CRS84h" ? { values: geom.coordinates[3] } : undefined,
        t: { values: datetime },
      }
    : domainType === "MultiPointSeries" || domainType === "MultiPoint"
    ? {
        composite: {
          dataType: "tuple",
          coordinates:
            //crs.code === "CRS84h"
            CRS84h
              ? ["x", "y", "z"]
              : crs.isGeographic
              ? ["y", "x"]
              : ["x", "y"],
          values: geom.coordinates,
        },
        //TODO: Get Z value from Polygon
        //https://docs.ogc.org/cs/21-069r2/21-069r2.html#_053fa087-bc08-4ef5-a98d-a9a915a2dc56:~:text=coordinate%20value%20only.-,The%20axis%20%22composite%22%20MUST%20have%20the%20data%20type%20%22polygon%22%20and%20the%20coordinate%20identifiers%20%22x%22%2C%22y%22%2C%20in%20that%20order.,-Domain%20example%3
      }
    : domainType === "Polygon" || domainType === "PolygonSeries"
    ? {
        composite: {
          dataType: "Polygon",
          coordinates: CRS84h
            ? ["x", "y", "z"]
            : crs.isGeographic
            ? ["y", "x"]
            : ["x", "y"],
          values: geom.coordinates,
        },
        t: { values: datetime },
      }
    : //domainType==="MultiPolygon"||domainType==="MultiPolygonSeries"?
      {
        composite: {
          coordinates: CRS84h
            ? ["x", "y", "z"]
            : crs.isGeographic
            ? ["y", "x"]
            : ["x", "y"],
          values: geom.coordinates,
          dataType: "Polygon",
        },
      };
}
const parseDbResToPointDomain = async (
  ctx: ExegesisContext,
  dbRes: any, // Model<any, any>[],
  matchedCollection: types.CollectionWithoutProps
): Promise<types.CoverageJSON> => {
  const { crs } = await edrCommonParams(ctx);
  const coverages: types.Coverage[] = [];
  interface DbRes {
    geom: any;
    wind?: string[][];
    date: string[];
    dew?: string[][];
    slp?: string[][];
    temperature?: string[][];
  }
  for (const row of dbRes) {
    row.datetime = Array.isArray(row.datetime) ? row.datetime : [row.datetime];
    const domainType = await domainTypeDetermination(
      row.geom.type,
      row[matchedCollection.datetimeColumn]
    );
    const axes = await parseAxes(
      domainType,
      row[matchedCollection.geomColumnName],
      crs,
      row[matchedCollection.datetimeColumn]
    );
    //console.log(row.geom);
    //console.log(row.geom.coordinates)

    coverages.push({
      type: "Coverage",
      domain: {
        type: "Domain",
        domainType,
        axes,
      },
      ranges: {
        windSpeed: row.windSpeed
          ? {
              type: "NdArray",
              dataType:
                typeof row.windSpeed[0] === "number" ? "float" : "string",
              axisNames: ["t"],
              shape: [row.windSpeed.length],
              values: row.windSpeed,
            }
          : undefined,
        windType: row.windType
          ? {
              type: "NdArray",
              dataType:
                typeof row.windSpeed[0] === "number" ? "float" : "string",
              axisNames: ["t"],
              shape: [row.windType.length],
              values: row.windType,
            }
          : undefined,
        windDirection: row.windDirection
          ? {
              type: "NdArray",
              dataType:
                typeof row.windDirection[0] === "number" ? "float" : "string",
              axisNames: ["t"],
              shape: [row.windDirection.length],
              values: row.windDirection,
            }
          : undefined,
        dewPointTemperature: row.dewPointTemperature
          ? {
              type: "NdArray",
              dataType:
                typeof row.dewPointTemperature[0] === "number"
                  ? "float"
                  : "string",
              axisNames: ["t"],
              shape: [row.dewPointTemperature.length],
              values: row.dewPointTemperature,
            }
          : undefined,
        temperature: row.temperature
          ? {
              type: "NdArray",
              dataType:
                typeof row.temperature[0] === "number" ? "float" : "string",
              axisNames: ["t"],
              shape: [row.temperature.length],
              values: row.temperature,
            }
          : undefined,
      },
    });
  }
  return {
    type: coverages.length > 1 ? "CoverageCollection" : "Coverage",
    //domainType: "PointSeries",
    parameters: await genParamNameObj(matchedCollection.edrVariables),
    coverages: coverages,
    referencing: [
      {
        coordinates: [
          "x",
          "y",
          ("composite" in coverages[0].domain.axes &&
            coverages[0].domain.axes.composite.coordinates.includes("z")) ||
          coverages[0].domain.axes.z
            ? "z"
            : undefined,
        ],
        system: {
          type: crs.type,
          id: crs.crs,
        },
      },
      "t" in coverages[0].domain.axes
        ? {
            coordinates: ["t"],
            system: {
              type:
                new Date(coverages[0].domain.axes.t[0]).getHours() !== 0
                  ? "UTC"
                  : "Gregorian",
              id:
                new Date(coverages[0].domain.axes.t[0]).getHours() !== 0
                  ? "UTC"
                  : "Gregorian",
              calendar: "Gregorian",
            },
          }
        : undefined,
    ],
  };
};
export default parseDbResToPointDomain;
