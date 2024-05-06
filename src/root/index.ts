import path from "path";
import parseOasDoc from "../components/parseOasDoc";
import { globalexegesisOptions } from "../server";
import * as exegesisExpress from "exegesis-express";
import helloWorld from "./controllers/helloWorldController";

const _rootDoc = parseOasDoc("./src/root/index.yaml","");

async function _rootInstance() {
  globalexegesisOptions.controllers ={
    helloWorldController:{
      helloWorld
    }
  } //path.join(process.cwd(), "./src/root/controllers");
  return exegesisExpress.middleware(await _rootDoc, globalexegesisOptions);
}

export default _rootInstance