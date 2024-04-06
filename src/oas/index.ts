/**
 * Merge all OAS files into a single OAS file
 * Insert the servers array to the final OAS file
 */
import * as exegesisExpress from 'exegesis-express';
import { serverConfig } from "../server";
import jsYAML from 'js-yaml';
import fs from 'fs';
import path from "path";


export async function initOASDocs(pathString: string) {

    //input relative to current folder
    // returns an OAS object
    //const serversArray = serverConfig.servers;

    //Load the OAS files
    // Features OAS Fragment
    const featuresOAS: any = jsYAML.load(fs.readFileSync(
        path.resolve(__dirname, '../standards/Features/featuresSpec.yaml'),
        'utf-8'
    ));

    // The main OAS file. Contains the main structure of the OAS document
    const mainOAS: any = jsYAML.load(fs.readFileSync(
        path.resolve(__dirname, path),
        'utf-8'
    ));

    mainOAS.paths = {  ...mainOAS.paths,...featuresOAS.paths, };
    //mainOAS.components.schemas = { ...featuresOAS.components.schemas, ...mainOAS.components.schemas };
    

    mainOAS.servers = serverConfig.servers;
    const finalYML = jsYAML.dump(mainOAS, { noRefs: true });

    //fs.writeFileSync(path.resolve(__dirname, '../oas/final.yml'), finalYML);
}