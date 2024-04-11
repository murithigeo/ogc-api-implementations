
import YAML from 'js-yaml';
import { serverConfig } from "../server";
import path from "path";
import fs from 'fs';


async function parseYamlToOpenAPIDoc(pathToDoc: string) {
    const parsedDoc = YAML.load(fs.readFileSync(path.resolve(__dirname, pathToDoc), 'utf-8'));
    return parsedDoc;
}

export async function initOASDocs() {
    const mainDoc: any = await parseYamlToOpenAPIDoc((serverConfig.activeStandards.filter(standard => standard.standard === 'Template'))[0].pathToDoc);
    mainDoc.servers=serverConfig.servers;
    for (const standard of serverConfig.activeStandards.filter(standard => standard.standard !== 'Template')) {
        const partialObject: any = await parseYamlToOpenAPIDoc(standard.pathToDoc);
        if (partialObject) {
            if (partialObject.paths) {
                mainDoc.paths = { ...mainDoc.paths, ...partialObject.paths }
            }
            if (partialObject.securitySchemes) {
                throw new Error('Security Schemes should be defined on the Template Document')
            }
            if (partialObject.components) {
                mainDoc.components = { ...mainDoc.components, ...partialObject.components }
            }
        }
    }
    const finalDoc=YAML.dump(mainDoc, { noRefs: true })
    fs.writeFileSync(path.resolve(__dirname, '../oas/openapi.yml'), finalDoc);
    //const finalObject = mainDoc.paths = { ...mainDoc.paths, ...partialObject }
};