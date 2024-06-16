import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import genParamNameObj from "../collection_instanceParamNamesObject";
import edrCommonParams from "../../../components/params";
import { parseTempCovJSON, parseWindCovJSON } from "../parseWeatherData";
import { Model } from "sequelize";

export const parseDbResToPointDomain = async (
  ctx: ExegesisContext,
  dbRes: any, // Model<any, any>[],
  matchedCollection: types.CollectionWithoutProps,
  pNames: string[]
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
    async function genXYZ(coordinates: number[]): Promise<types.Axes> {
      return {
        composite: {
          dataType: "Point",
          values: coordinates as number[],
          coordinates: crs.isGeographic
            ? (coordinates as number[]).length > 2
              ? ["y", "x", "z"]
              : ["y", "x"]
            : (coordinates as number[]).length > 2
            ? ["x", "y", "z"]
            : ["x", "y"],
        },
        t: {
          values: row[matchedCollection.datetimeColumns] as string[],
        },
      };
    }
    //console.log(row.geom);
    //console.log(row.geom.coordinates)
    const axesValues = await genXYZ(
      row[matchedCollection.geomColumnName].coordinates
    );
    const windObservations = row.wind
      ? await parseWindCovJSON(row.wind, 1, 10)
      : undefined;
    const dewPointTemp = row.dew
      ? await parseTempCovJSON(row.dew, 10)
      : undefined;
    const temperature = row.temperature
      ? await parseTempCovJSON(row.temperature, 10)
      : undefined;

    coverages.push({
      type: "Coverage",
      domain: {
        type: "Domain",
        domainType: "PointSeries",
        axes: axesValues,
      },
      ranges: {
        windSpeed: pNames.includes("windSpeed")
          ? {
              type: "NdArray",
              dataType:
                typeof windObservations.windSpeed[0] === "number"
                  ? "float"
                  : "string",
              axisNames: ["t"],
              shape: [windObservations.windSpeed.length],
              values: await Promise.all(windObservations.windSpeed),
            }
          : undefined,
        windType: pNames.includes("windType")
          ? {
              type: "NdArray",
              dataType:
                typeof windObservations.windSpeed[0] === "number"
                  ? "float"
                  : "string",
              axisNames: ["t"],
              shape: [windObservations.windType.length],
              values: await Promise.all(windObservations.windType),
            }
          : undefined,
        windDirection: pNames.includes("windDirection")
          ? {
              type: "NdArray",
              dataType:
                typeof windObservations.windDirection[0] === "number"
                  ? "float"
                  : "string",
              axisNames: ["t"],
              shape: [windObservations.windDirection.length],
              values: await Promise.all(windObservations.windDirection),
            }
          : undefined,
        dewPointTemperature: pNames.includes("dewPointTemperature")
          ? {
              type: "NdArray",
              dataType:
                typeof dewPointTemp[0] === "number" ? "float" : "string",
              axisNames: ["t"],
              shape: [dewPointTemp.length],
              values: await Promise.all(dewPointTemp),
            }
          : undefined,
        temperature: pNames.includes("temperature")
          ? {
              type: "NdArray",
              dataType: typeof temperature[0] === "number" ? "float" : "string",
              axisNames: ["t"],
              shape: [temperature.length],
              values: await Promise.all(temperature),
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
