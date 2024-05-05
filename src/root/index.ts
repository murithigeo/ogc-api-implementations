import path from "path";
import parseOasDoc from "../components/parseOasDoc";
import { globalexegesisOptions } from "../server";
import * as exegesisExpress from "exegesis-express";

const _rootDoc = parseOasDoc("./src/root/index.yaml");

async function _rootInstance() {
  globalexegesisOptions.controllers = path.resolve(__dirname, "./controllers");
  console.log(globalexegesisOptions)
  return exegesisExpress.middleware(await _rootDoc, globalexegesisOptions);
}

export default _rootInstance