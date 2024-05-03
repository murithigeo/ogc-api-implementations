import YAML from "js-yaml";
import fs from "fs";
import path from "path";
import { servers } from "../server";
import alterServers from "./alterOasServers";
async function parseOasFragment(yamlFile: any): Promise<any> {
  const doc = YAML.load(fs.readFileSync(yamlFile, "utf-8"));
  return doc;
}
async function parseOasDoc(yamlFile: any, standard: "features" | "edr") {
  const mainDoc = await parseOasFragment(
    path.resolve(__dirname, "../oas/index.yaml")
  );
  const fragmentToParse: any = await parseOasFragment(yamlFile);
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
