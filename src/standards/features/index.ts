import * as exegesisExpress from "exegesis-express";
import * as path from "path";
import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
import validateRequestsPlugin from "./plugins/exegesis-plugin-validateRequests";
import { F_AssociatedType } from "../../types";
import { Crs_prop } from "../../types";

//The mandated defaults
const crs84Uri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
const crs84hUri = "http://www.opengis.net/def/crs/OGC/0/CRS84h";

const _allCrsProperties: Crs_prop[] = [
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
const _allsupportedcrsUris = _allCrsProperties.map(
  (crsObject) => crsObject.uri
);

//Temporal Reference System Identifier
const trs = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";

//All possible content-negotiation values
const allowed_F_values: F_AssociatedType[] = [
  {
    f: "json",
    type: "application/json", //This value will be mutated during link creation to application/geo+json when appropriate
  },
  {
    f: "yaml",
    type: "text/yaml",
  },
];

//collections configuration
interface CollectionConfig {
  collectionId: string;
  modelName: string;
  bboxgenScope: string;
  zAxis: boolean;
  datetimeColumns: null | string[]; //The dbQuery will query each column  included
  title?: string;
  description?: string;
  supportedCrs?: string[]; //Allow for collection specific CRS's. These must also be valid in _allCrsProperties
}
interface CollectionsConfig {
  fallbackCrs: string[];
  collections: CollectionConfig[];
}
const collections_properties: CollectionsConfig = {
  fallbackCrs: [crs84Uri],
  collections: [
    {
      collectionId: "mountains",
      bboxgenScope: "bboxgenScope",
      zAxis: true,
      datetimeColumns: null,
      modelName: "mountains",
      supportedCrs: ["http://www.opengis.net/def/crs/EPSG/0/4326"],
    },
  ],
};

export const featuresOasDoc = parseOasDoc(
 './src/standards/features/index.yaml',
  "features"
);

async function featuresExegesisInstance() {
  //globalexegesisOptions.controllers = path.resolve(__dirname, "./controllers");
  globalexegesisOptions.plugins = [
    validateRequestsPlugin(
      allowed_F_values.map((opt) => opt.f),
      ["apiKey"], //Used for auth but is not listed by the queryParams Interface
      //Generate a list of collections
      collections_properties.collections.map(
        (collection) => collection.collectionId
      )
    ),
  ];
  return exegesisExpress.middleware(
    await featuresOasDoc,
    globalexegesisOptions
  );
  //return exegesisInstance;
}
export {
  _allCrsProperties,
  _allsupportedcrsUris,
  collections_properties,
  CollectionsConfig,
  CollectionConfig,
  allowed_F_values,
  crs84Uri,
  crs84hUri,
  trs,
};
export default featuresExegesisInstance;
