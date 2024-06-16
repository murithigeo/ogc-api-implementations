import * as exegesisExpress from "exegesis-express";
import * as path from "path";
import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
import allPlugins from "../components/plugins";
import { F_AssociatedType } from "../../types";
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
import { genericDataQueryItemConfig } from "../edr/types";
import * as crsDetails from "../components/crsdetails";
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
  id: string;
  modelName: string;
  bboxgenScope: string;
  zAxis: boolean;
  datetimeColumns: null | string[]; //The dbQuery will query each column  included
  title?: string;
  description?: string;
  supportedCrs?: string[]; //Allow for collection specific CRS's. These must also be valid in _allCrsProperties
  data_queries: {
    items: genericDataQueryItemConfig;
  };
}
interface CollectionsConfig {
  fallbackCrs: string[];
  collections: CollectionConfig[];
}
const collections_properties: CollectionsConfig = {
  fallbackCrs: [crsDetails.crs84Uri],
  collections: [
    {
      id: "mountains",
      bboxgenScope: "bboxgenScope",
      zAxis: true,
      datetimeColumns: null,
      modelName: "mountains",
      supportedCrs: ["http://www.opengis.net/def/crs/EPSG/0/4326"],
      data_queries: {
        items: {},
      },
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
  globalexegesisOptions.plugins = [...allPlugins([])];
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
