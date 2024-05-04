import * as YAML from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { servers } from "../server";
import alterServers from "./alterOasServers";

async function parseOasFragment(yamlFile: any): Promise<any> {
  return YAML.load(fs.readFileSync(yamlFile, "utf-8"));
}

async function parseOasDoc(yamlFile: any, standard: "features" | "edr") {
  let mainDoc: any, fragmentToParse: any;
  mainDoc = await parseOasFragment(
    path.join(process.cwd(), "./src/oas/index.yaml")
  );
  fragmentToParse = await parseOasFragment(path.join(process.cwd(), yamlFile));

  mainDoc.servers = await alterServers(servers, standard);

  if (fragmentToParse) {
    if (fragmentToParse.securitySchemes) {
      throw new Error("SecuritySchemes must be defined in src/oas/index.yaml");
    }
    if (fragmentToParse.paths) {
      mainDoc.paths = { ...mainDoc.paths, ...fragmentToParse.paths };
    }
    if (fragmentToParse.components) {
      mainDoc.components = {
        ...mainDoc.components,
        ...fragmentToParse.components,
      };
    }
  }
  return mainDoc;
}

export default parseOasDoc;
