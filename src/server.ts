
import express, { query } from 'express';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import * as exegesisExpress from 'exegesis-express';
import fs from 'fs';
import { APIConfig } from './types';
import os from 'os';
import { apiKeyAuthenticator } from './authentication/apikey';
import { basicAuthenticator } from './authentication/basicAuth';
import { initOASDocs } from './oas';

const serverConfigImport = fs.readFileSync(path.join(__dirname, '.', 'server.config.json'), 'utf-8');
export const serverConfig: APIConfig = JSON.parse(serverConfigImport);

// Define the http protocol
let protocol: 'http' | 'https';
let baseURL = process.env.HOST_ADDR || 'localhost';
const PORT = parseInt(<string>process.env.PORT) || 80;


/**
 * Overwrite baseURL with the IP Address of the machine if the baseURL is localhost
 * @external @link https://cite.opengeospatial.org/teamengine/about/ogcapi-features-1.0/1.0/site/#:~:text=HTTP%20calls%20to%20localhost%20are%20not%20working%20with%20Docker.%20You%20need%20to%20make%20calls%20using%20host%20IP
 */

(() => {
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
    url: `http://${ips}:${PORT}`,
    description: 'Localhost IP'
});
})();

//Run the function to initialize the OAS docs after the baseURL has been set
initOASDocs();
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
    app.use(await exegesisExpress.middleware(path.resolve(__dirname, './oas/final.yml'), {
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

createServer()
    .then(
        server => {
            server.listen(PORT, () => {
                console.log(`LandingPage or TeamEngine Endpoint is available at ${process.env.DOMAIN_NAME}/`);
                console.log(`API documentation is available at ${process.env.DOMAIN_NAME}/api.html`);
            });
        });

