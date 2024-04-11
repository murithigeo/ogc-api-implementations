
import express from 'express';
import morgan from 'morgan';
import http from 'http';
import path, { parse } from 'path';
import * as exegesisExpress from 'exegesis-express';
import fs from 'fs';
import { APIConfig, OgcStandard } from './types';
import os from 'os';
import { apiKeyAuthenticator } from './authentication/apikey';
import { basicAuthenticator } from './authentication/basicAuth';
import YAML from 'js-yaml';
import { initOASDocs } from './oas';
process.env.NODE_ENV = 'dev'; //This also assumes that the development occurs locally


const serverConfig = YAML.load(fs.readFileSync(path.join(__dirname, '.', 'server.config.yaml'), 'utf-8')) as APIConfig;

//
if (process.env.NODE_ENV === 'dev') {
    var ifaces: any = os.networkInterfaces();
    var ips: any = 0;
    Object.keys(ifaces).forEach((dev) => {
        if (!dev.toLowerCase().includes('wsl')) { // Filter out WSL interfaces
            ifaces[dev].forEach((details: any) => {
                if (details.family === 'IPv4' && !details.internal) {
                    ips = details.address;
                }
            });
        }
    });
    serverConfig.servers.push({
        url: `http://${ips}`,
        description: `IP Adress of the local development machine. Used for testing OGC API Endpoints`
    });
}

export {serverConfig};

//console.log(serverConfig);
// Define the http protocol
let protocol: 'http' | 'https';
let baseURL = process.env.HOST_ADDR || 'localhost';
const PORT = parseInt(<string>process.env.PORT) || 80;


//The location at which the API is hosted
const location: string = '';
// A full http link pointing to the base url of the API
process.env.ROOT_URL = `${protocol}://${baseURL}${PORT === 80 || PORT === 443 || PORT === 3000 ? '' : ':' + PORT}${location}`

// Configure exegesis & express
async function createServer() {
    const app = express();

    // Configure access log
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, "./logs/reqs.log"),
        { flags: "a" }
    );

    app.use(morgan("combined", { stream: accessLogStream }));

    // Init exegesis
    //    const openAPiDoc = initOASDocs()
    // Instead of passing a path to final file, just leave file as is and push servers array into object at startup
    // Instead of using a controller & scalar CDN to render the OAS Doc, use the NPM Package.

    app.use(await exegesisExpress.middleware(path.resolve(
        __dirname, './oas/openapi.yml'
    ), {
        controllers: path.resolve(__dirname, './lib/controllers'),
        controllersPattern: '**/*.@(ts)',
        allowMissingControllers: false,
        ignoreServers: false,
        authenticators: {
            ApiKeyAuth: apiKeyAuthenticator,
            BasicAuth: basicAuthenticator
        }
    }));


    const server = http.createServer(app);
    return server;
};

initOASDocs().then(() => {
    createServer()
        .then(
            server => {
                server.listen(PORT, () => {
                    for (const serverURL of serverConfig.servers){
                        console.log(`LandingPage or TeamEngine Endpoint is available at ${serverURL.url}`);
                        console.log(`API documentation is available at ${serverURL.url}/api.html`);   
                    }
                });
            }).catch(err => {
                console.error(err.stack);
                process.exit(1)
            });
}).catch(error => {
    //throw new Error('Error parsing the OpenAPI Document. Check for errors: ',error)
    console.error('Error parsing OpenAPIDoc: ', error.stack)
    process.exit(1)
});

