//type windObservation =[number,number,string,]

/**
 * @type speedRate 
 */
type SpeedRate = number;
type SpeedUnit = "m/s";
type DirectionQualityCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TypeCode = string | number;
type DirectionAngle = number;
type WindObservation = [
  DirectionAngle,
  DirectionQualityCode,
  TypeCode,
  SpeedRate
];

/**
 * This assumes that you want to get all elements of the array
 * @param WindObservation
 */

async function generateWindMetadata(windObservation: WindObservation) {

  return {
    speed: windObservation[3],
    direction: windObservation[0],
    type: windObservation[2],
  };
}
