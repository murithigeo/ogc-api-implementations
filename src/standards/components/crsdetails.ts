import sequelize from "./models";
import * as stdRootTypes from "../types";
import { Op } from "sequelize";
//The mandated defaults
export const crs84Uri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
export const crs84hUri = "http://www.opengis.net/def/crs/OGC/0/CRS84h";

const _allCrsProperties: stdRootTypes.CrsDetail[] = /*
 * @type uri formed by computing `http://www.opengis.net/def/crs/{authority}/{version}/{code}
 */ [
  {
    authority: "OGC",
    version: 1.3,
    code: "CRS84",
    srid: 4326,
    wkt: 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]',
    //type: ?"GeographicCRS":"PlanarCRS",
    //auth_name: 'OGC',
    isGeographic: false,
    //uri: `http://www.opengis.net/def/crs/${authority}/${version}/${code}`
  },
  {
    code: 4326,
    version: 0,
    srid: 4326,
    authority: "EPSG",
    wkt: 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]',
    isGeographic: true,
  },
  {
    authority: "OGC",
    srid: 4326,
    version: 0,
    wkt: 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]',
    isGeographic: false,
    code: "CRS84h",
  },
];

for (const crsObject of _allCrsProperties) {
  crsObject.type = crsObject.isGeographic ? "GeographicCRS" : "PlanarCRS";
  crsObject.crs = `http://www.opengis.net/def/crs/${crsObject.authority}/${crsObject.version}/${crsObject.code}`;
}

/*
(async (_allCrsProperties: stdRootTypes.CrsDetail[]) => {

  const dets = (await sequelize.models.spatial_ref_sys.findAll({
    raw: true,
    attributes: ["srtext", "srid"],
    where: {
      srid: {
        [Op.in]: _allCrsProperties.map((det) => det.srid),
      },
    },
  })) as { srtext: string; srid: number }[];

  for (const crsObject of _allCrsProperties) {
    crsObject.wkt = dets.find((det) => det.srid === crsObject.srid).srtext;
  }
  //return _allCrsProperties;
})(_allCrsProperties);

*/
/**
 * Generate a string[] for the above CRS comprised of the uri attribute.
 */
export const _allsupportedcrsUris = _allCrsProperties.map(
  (crsObject) => crsObject.crs
);

export { _allCrsProperties };

//Temporal Reference System Identifier
export const trs = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";
