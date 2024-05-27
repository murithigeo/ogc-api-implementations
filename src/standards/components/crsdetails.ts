import sequelize from "./models"
import { Crs_prop } from "../../types";

//The mandated defaults
export const crs84Uri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
export const crs84hUri = "http://www.opengis.net/def/crs/OGC/0/CRS84h";

export const _allCrsProperties: Crs_prop[] = /*
 * @type uri formed by computing `http://www.opengis.net/def/crs/{authority}/{version}/{code}
 */ [
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
    version: 0,
    isGeographic: false,
    code: "CRS84h",
  },
];

//Create uris pointing to the schema

for (const crsObject of _allCrsProperties) {
  crsObject.crs = `http://www.opengis.net/def/crs/${crsObject.authority}/${crsObject.version}/${crsObject.code}`;
  sequelize.models.spatial_ref_sys
    .findOne({
      raw: true,
      attributes: ["srtext"],
      where: {
        srid: crsObject.srid,
      },
    })
    .then((res: any) => {
      crsObject.wkt = res.srtext;
    })
    .catch((err) => {
      throw new Error("Cannot validate Coordinate Reference Systems");
    });
}

/**
 * Generate a string[] for the above CRS comprised of the uri attribute.
 */
export const _allsupportedcrsUris = _allCrsProperties.map(
  (crsObject) => crsObject.crs
);

//Temporal Reference System Identifier
export const trs = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";
