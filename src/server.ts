import express from "express";
import morgan from "morgan";
import http from "http";
import path, { parse } from "path";
import * as exegesisExpress from "exegesis-express";
import fs from "fs";
import { ServerConfig, StandardsInterface } from "./types";
import os from "os";
import { apiKeyAuthenticator } from "./authentication/apikey";
import { basicAuthenticator } from "./authentication/basicAuth";
import YAML from "js-yaml";
import { generateOasObject } from "./oas";
import sequelize from "./dbconnection";
process.env.NODE_ENV = "dev"; //This also assumes that the development occurs locally

const serverConfig = YAML.load(
  fs.readFileSync(path.join(__dirname, ".", "server.config.yaml"), "utf-8")
) as ServerConfig;
fs.writeFileSync(
  path.resolve(__dirname, "server.config.json"),
  JSON.stringify(serverConfig)
);
//console.log(serverConfig)
//

//check if model works

if (process.env.NODE_ENV === "dev") {
  var ifaces: any = os.networkInterfaces();
  var ips: any = 0;
  Object.keys(ifaces).forEach((dev) => {
    if (!dev.toLowerCase().includes("wsl")) {
      // Filter out WSL interfaces
      ifaces[dev].forEach((details: any) => {
        if (details.family === "IPv4" && !details.internal) {
          ips = details.address;
        }
      });
    }
  });
  const devServers = [
    {
      url: "http://localhost",
      description: `Localhost address. Used for testing OGC API Endpoints`,
    },
  ];

  //if dev machine is not connected to a LAN, the ips = 0 which is not a valid URL
  if (ips !== 0) {
    devServers.push({
      url: `http://${ips}`,
      description: `IP Adress of the local development machine. Used for testing OGC API Endpoints`,
    });
  }
  /**
   * if @var ServersArray is nullish, instanciate the servers object
   * if not nullish, just push to it
   */
  !serverConfig.servers
    ? (serverConfig.servers = devServers)
    : serverConfig.servers.push(...devServers);
}

export { serverConfig };

//ExegesisOptions


//console.log(serverConfig);
// Define the http protocol
let protocol: "http" | "https";
let baseURL = process.env.HOST_ADDR || "localhost";
const PORT = parseInt(<string>process.env.PORT) || 80;

//The location at which the API is hosted
const location: string = "";
// A full http link pointing to the base url of the API
process.env.ROOT_URL = `${protocol}://${baseURL}${
  PORT === 80 || PORT === 443 || PORT === 3000 ? "" : ":" + PORT
}${location}`;

// Configure exegesis & express
async function createServer(standards: StandardsInterface[]) {
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

  const exegesisInstance = await exegesisExpress.default(
    await generateOasObject(serverConfig.standards),
    {
        controllers: path.resolve(
            __dirname,'./controllers'
          ),
        controllersPattern: "**/**/*.@(ts)",
        allowMissingControllers: true,
        ignoreServers: false,
        autoHandleHttpErrors:true,
        authenticators: {
          ApiKeyAuth: apiKeyAuthenticator,
          BasicAuth: basicAuthenticator,
        },
      }
  );
  console.log(exegesisInstance);
  app.use(exegesisInstance);
  const server = http.createServer(app);
  return server;
}

createServer(serverConfig.standards)
  .then((server) => {
    server.listen(PORT, () => {
      if (serverConfig.servers) {
        for (const serverURL of serverConfig.servers) {
          console.log(
            `LandingPage or TeamEngine Endpoint is available at ${serverURL.url}`
          );
          console.log(
            `API documentation is available at ${serverURL.url}/api.html`
          );
        }
      }
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
