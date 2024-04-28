import * as exegesisExpress from "exegesis-express";
import path from "path";
import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
//console.log(globalexegesisOptions)

async function featuresExegesisInstance() {
  globalexegesisOptions.controllers= path.resolve(
    __dirname,
    "./controllers"
  );
  const oasDoc = await parseOasDoc(path.resolve(__dirname, "./index.yaml"));
  const exegesisInstance = await exegesisExpress.default(
    oasDoc,
    globalexegesisOptions
  );
  return exegesisInstance;
}

export default featuresExegesisInstance;
