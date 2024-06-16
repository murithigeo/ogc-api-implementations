//type windObservation =[number,number,string,]
import unitConverter from "convert";
/**
 * @type speedRate
 */
type SpeedRate = string;
type SpeedUnit = "m/s";
type DirectionQualityCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TypeCode = string | number;
type DirectionAngle = string;
type WindObservation = [
  DirectionAngle,
  DirectionQualityCode,
  TypeCode,
  SpeedRate,
  string //SpeedRate QualityCode
];

/**
 * This assumes that you want to get all elements of the array
 * @function getWindObservations generate an object from the returned array of temperature
 * @param WindObservation
 * @returns //{windSpeed,windDirection,windType}
 */

export const parseWind = async (
  windObservation: WindObservation,
  directionScalingFactor: number,
  speedScalingFactor: number
): Promise<{ windDirection: number; windSpeed: number; windType: string }> => {
  let windType: string;
  switch (windObservation[2]) {
    case "A":
      windType = "Abridged Beaufort";
      break;
    case "B":
      windType = "Beaufort";
      break;
    case "C":
      windType = "Calm";
      break;
    case "H":
      windType = "5-Minute Average Speed";
      break;
    case "N":
      windType = "Normal";
      break;
    case "R":
      windType = "60-Minute Average Speed";
      break;
    case "Q":
      windType = "Squall";
      break;
    case "T":
      windType = "180-Minute Average Speed";
      break;
    case "V":
      windType = "Variable";
      break;
    case "9":
      windType = "Missing";
      break;
  }

  return {
    windSpeed: parseInt(windObservation[3]) / speedScalingFactor,
    windDirection: parseInt(windObservation[0], 10) / directionScalingFactor,
    windType,
  };
};

type RawPressure = [string, string]; //[actualPressure,qualitycode]
export const parsePressure = async (
  rawPressure: RawPressure,
  scalingFactor: number
): Promise<number> => parseInt(rawPressure[0], 10) / scalingFactor;

/**
 * Used in GeoJSON
 * @param rawTemp Array containing a [temperature,qualityCode]
 * temperature is in Celsius, needing conversion to Kelvin
 * if(temperature=+9999= missing)
 * @temperatures air/dew
 */
type RawTemperature = [string, string]; //[value,qualitycode]

export const parseTemp = async (
  rawTemp: RawTemperature,
  scalingFactor: number
): Promise<number> =>
  unitConverter(parseInt(rawTemp[0], 10) / scalingFactor, "celsius").to(
    "kelvin"
  );

/**
 * @function
 * @description parse Temperature Values but for CovJson
 */

export const parseTempCovJSON = async (
  tempValuesArray: RawTemperature[],
  scalingFactor: number
) =>
  tempValuesArray.map(
    async (rawTemp) => await parseTemp(rawTemp, scalingFactor)
  );

export const parsePressureCovJSON = async (
  pressureValuesArray: RawPressure[],
  scalingFactor: number
) =>
  pressureValuesArray.map(
    async (pressureVal) => await parsePressure(pressureVal, scalingFactor)
  );

export const parseWindCovJSON = async (
  windValuesArray: WindObservation[],
  directionScalingFactor: number,
  speedScalingFactor: number
) => {
  const parsedWind = windValuesArray.map(
    async (windObs) =>
      await parseWind(windObs, directionScalingFactor, speedScalingFactor)
  );
  return {
    windDirection: parsedWind.map(async (val) => (await val).windDirection),
    windSpeed: parsedWind.map(async (val) => (await val).windSpeed),
    windType: parsedWind.map(async (val) => (await val).windType),
  };
};
