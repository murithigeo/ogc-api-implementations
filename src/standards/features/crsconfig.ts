import { Crs_prop } from "../../types";
const crs84Uri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
const crs84hUri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84h"
const crs_properties: Crs_prop[] = [
  {
    authority: "OGC",
    version: 1.3,
    code: "CRS84",
    srid: 4326,
    //auth_name: 'OGC',
    isGeographic: false,
    //uri: `http://www.opengis.net/def/crs/${authority}/${version}/${code}`
  },
  {
    code: 4326,
    version: 0,
    srid: 4326,
    authority: "EPSG",
    isGeographic: true,
  },
  {
    authority: "OGC",
    srid: 4326,
    version: 1.3,
    isGeographic: false,
    code: "CRS84h",
  },
];

for (const crsObject of crs_properties) {
  crsObject.uri = 
    `http://www.opengis.net/def/crs/${crsObject.authority}/${crsObject.version}/${crsObject.code}`
  
}

///console.log(crs_properties)
/**
 * Generate a string[] for the above CRS comprised of the uri attribute.
 */
const supportedcrs_array = crs_properties.map((crsObject) => crsObject.uri);

const trs = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
export { supportedcrs_array, crs_properties, trs, crs84Uri, crs84hUri };
