import YAML from "js-yaml";
import fs from "fs";
import path from "path";
import { serverConfig } from "../server";
import { StandardsInterface } from "../types";

function parseYamlToOpenAPIDoc(pathToDoc: string) {
  const doc = YAML.load(
    fs.readFileSync(path.resolve(__dirname, pathToDoc), "utf-8")
  );
  return doc;
}

export async function generateOasObject(standards: StandardsInterface[]) {
  const oasTemplate: any = parseYamlToOpenAPIDoc("./common.yaml");
  oasTemplate.servers = serverConfig.servers;

  for(const standard of standards){
    if (standard.publish === true) {
        const fragmentOAS: any = parseYamlToOpenAPIDoc(standard.pathToDoc);
        //console.log('fragmentOAS',fragmentOAS)
        if (fragmentOAS) {
          if (fragmentOAS.paths) {
            oasTemplate.paths = { ...oasTemplate.paths, ...fragmentOAS.paths };
          }
          if (fragmentOAS.securitySchemes) {
            throw new Error(
              "Security Schemes should be defined on the Template Document"
            );
          }
          if (fragmentOAS.components) {
            oasTemplate.components = {
              ...oasTemplate.components,
              ...fragmentOAS.components,
            };
          }
        }
      }
  }
  
  //console.log(oasTemplate);
  //console.log(Object.keys(oasTemplate.paths).length);
  if (oasTemplate.paths === (undefined || null)||
    Object.keys(oasTemplate.paths).length < 1
  ) {
    throw new Error("A standard must be loaded or some paths must be existent");
  }
  return oasTemplate;
}
