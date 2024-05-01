import * as exegesisExpress from "exegesis-express";
import path from "path";
import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
import validateRequestsPlugin from "./plugins/exegesis-plugin-validateRequests";
//console.log(globalexegesisOptions)
export const featuresOasDoc = parseOasDoc(
  path.resolve(__dirname, "./index.yaml")
);
async function featuresExegesisInstance() {
  globalexegesisOptions.controllers = path.resolve(__dirname, "./controllers");
  globalexegesisOptions.plugins = [
    validateRequestsPlugin(["yaml", "json"], ["apiKey"], _listOfCollections),
  ];
  return exegesisExpress.middleware(
    await featuresOasDoc,
    globalexegesisOptions
  );
  //return exegesisInstance;
}

interface CollectionConfig {
  collectionId: string;
  modelName: string;
  bboxgenScope: string;
  zAxis: boolean;
  datetimeColumns: null | string[];
  title?: string;
  description?: string;
}
const collections: CollectionConfig[] = [
  {
    collectionId: "mountains",
    bboxgenScope: "bboxgenScope",
    zAxis: true,
    datetimeColumns: null,
    modelName: "mountains",
  },
];

const _listOfCollections = collections.map((coll) => coll.collectionId);
export { _listOfCollections, collections, CollectionConfig };
export default featuresExegesisInstance;
