import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import * as observationParsers from "../weatherMetadata/parseObservations";

const parseDbResToEdrFeature = async (
  dbRes: any,
  geomColumnName: string,
  featureIdColumnName: string,
  pNames: string[]
): Promise<types.EdrGeoJSONFeature[]> => {
  const features: types.EdrGeoJSONFeature[] = [];
  if (dbRes.length < 1) {
    return features;
  } else {
    for (const row of dbRes) {
      const {
        [geomColumnName]: geom,
        [featureIdColumnName]: id,
        ...others
      } = row;
      const { type, coordinates } = geom;
      const windObservations = others.wind
        ? await observationParsers.parseWind(others.wind, 1, 10)
        : undefined;
      features.push({
        type: "Feature",
        id,
        geometry: { type, coordinates },
        properties: {
          datetime: others.date,
          label: others.name,
          wmo_id: id,
          adm0: others.adm0,
          subregion: others.subregion,
          edrqueryendpoint: "",
          "parameter-name": pNames,
          temperature: others.temperature
            ? await observationParsers.parseTemp(others.temperature, 10)
            : undefined,
          pressure: others.pressure
            ? await observationParsers.parsePressure(others.pressure, 10)
            : undefined,
          windType: pNames.includes("windType")
            ? windObservations.windType
            : undefined,
          windSpeed: pNames.includes("windSpeed")
            ? windObservations.windSpeed
            : undefined,
          windDirection: pNames.includes("windDirection")
            ? windObservations.windDirection
            : undefined,
          dewPointTemperature: pNames.includes("dewPointTemperature")
            ? await observationParsers.parseTemp(others.dew, 10)
            : undefined,
        },
      });
    }
  }
  return features;
};

export default parseDbResToEdrFeature;
