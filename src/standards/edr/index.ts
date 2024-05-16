import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
import {
  edrGetServiceDesc,
  edrGetServiceDoc,
} from "./controllers/edrApiController";
import edrGetConformance from "./controllers/edrConformanceController";
import edrGetRoot from "./controllers/edrRootController";
import * as exegesisExpress from "exegesis-express";
export const edrDocument = parseOasDoc("./src/standards/edr/index.yaml", "edr");

export default async function edrExegesisInstance() {
  globalexegesisOptions.controllers = {
    edrRootController: {
      edrGetRoot, // {root}
    },
    edrConformanceController: {
      edrGetConformance, // {root}/conformance
    },
    edrApiController: {
      edrGetServiceDesc, // {root}/api
      edrGetServiceDoc, // {root}/api.html
    },
  };
  return await exegesisExpress.middleware(
    await edrDocument,
    globalexegesisOptions
  );
}
