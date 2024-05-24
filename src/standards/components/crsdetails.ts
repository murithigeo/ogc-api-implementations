
//The mandated defaults
export const crs84Uri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
export const crs84hUri = "http://www.opengis.net/def/crs/OGC/0/CRS84h";

export const _allCrsProperties: {
  /**
   * @type uri formed by computing `http://www.opengis.net/def/crs/{authority}/{version}/{code}
   */
  uri?: string;
  version: number;
  code: string | number;
  srid: number;
  authority: string;
  isGeographic: boolean;
}[] = [
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
  crsObject.uri = `http://www.opengis.net/def/crs/${crsObject.authority}/${crsObject.version}/${crsObject.code}`;
}

/**
 * Generate a string[] for the above CRS comprised of the uri attribute.
 */
export const _allsupportedcrsUris = _allCrsProperties.map(
  (crsObject) => crsObject.uri
);

//Temporal Reference System Identifier
export const trs = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";
