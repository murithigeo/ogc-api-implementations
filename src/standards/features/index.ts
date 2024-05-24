import * as exegesisExpress from "exegesis-express";
import * as path from "path";
import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
import validateRequestsPlugin from "./plugins/exegesis-plugin-validateRequests";
import { F_AssociatedType } from "../../types";
import { Crs_prop } from "../../types";
import _getFeaturesRoot from "./controllers/rootController";
import getConformance from "./controllers/conformanceController";
import { getServiceDesc, getServiceDoc } from "./controllers/apiController";
import {
  queryAllItems,
  querySpecificItem,
} from "./controllers/featuresController";
import getFeaturesRoot from "./controllers/rootController";
import {
  getCollectionOne,
  getCollectionsAll,
} from "./controllers/collectionsController";
import * as crsDetails from '../components/crsdetails';
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
  fallbackCrs: [crsDetails.crs84Uri],
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
  "./src/standards/features/index.yaml",
  "features"
);

async function featuresExegesisInstance() {
  globalexegesisOptions.controllers = {
    featuresRootController: {
      getFeaturesRoot,
    },
    featuresConformanceController: {
      getConformance,
    },
    featuresApiController: {
      getServiceDesc,
      getServiceDoc,
    },
    featuresItemsController: {
      querySpecificItem,
      queryAllItems,
    },
    featuresCollectionsController: {
      getCollectionOne,
      getCollectionsAll,
    },
  };
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
  collections_properties,
  CollectionsConfig,
  CollectionConfig,
  allowed_F_values,
};
export default featuresExegesisInstance;
