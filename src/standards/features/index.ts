import * as exegesisExpress from "exegesis-express";
import path from "path";
import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
//console.log(globalexegesisOptions)
export const featuresOasDoc = parseOasDoc(path.resolve(__dirname, "./index.yaml"));
async function featuresExegesisInstance() {
  globalexegesisOptions.controllers = path.resolve(__dirname, "./controllers");

  return exegesisExpress.middleware(
    await featuresOasDoc,
    globalexegesisOptions
  );
  //return exegesisInstance;
}

export default featuresExegesisInstance;
