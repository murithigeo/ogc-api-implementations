import { RawGeoDataResult, Feature } from "../../../types";

async function parseDbResToGeoJson(
  dbResult: RawGeoDataResult[],
  geomColumnName: string,
  featureIdColumnName: string | number
) {
  var newFeaturesArray: Feature[] = [];
  /**
   * @param dbResult is less than one, then no record present thus no features
   */
  if (dbResult.length < 1) {
    newFeaturesArray = [];
  } else {
    /**
     * if length is not less than 1, then there are features present
     */
    for (const record of dbResult) {
      const { geom, [featureIdColumnName]: id, ...otherProperties } = record;
      const { type, coordinates } = geom;
      const propertiesObject = {
        [featureIdColumnName]: id,
        ...otherProperties,
      };
      const feature = {
        type: "Feature",
        id: id,
        geometry: {
          type,
          coordinates,
        },
        properties: propertiesObject,
      };
      newFeaturesArray.push(feature as Feature); //Don't know whats the reason for the error
    }
  }
  return newFeaturesArray;
}

export default parseDbResToGeoJson;
