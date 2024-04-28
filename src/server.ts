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
import genServerObjectsForDevMode from "./components/localServers";
import featuresExegesisInstance from "./standards/features";
import validateQueryParams from "./components/validateQueryParameters";
process.env.NODE_ENV = "dev"; //This also assumes that the development occurs locally

const serverConfig = YAML.load(
  fs.readFileSync(path.join(__dirname, ".", "server.config.yaml"), "utf-8")
) as ServerConfig;
fs.writeFileSync(
  path.resolve(__dirname, "server.config.json"),
  JSON.stringify(serverConfig)
);
if (!serverConfig.servers) {
  serverConfig.servers = [];
}
Promise.resolve(genServerObjectsForDevMode(serverConfig.servers));

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

export const globalexegesisOptions: exegesisExpress.ExegesisOptions = {
  controllersPattern: "**/**/*.@(ts)",
  allowMissingControllers: true,
  ignoreServers: false,
  autoHandleHttpErrors: true,
  authenticators: {
    ApiKeyAuth: apiKeyAuthenticator,
    BasicAuth: basicAuthenticator,
  },
};
// Configure exegesis & express
async function createServer() {
  const app = express();

  // Configure access log
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "./logs/reqs.log"),
    { flags: "a" }
  );

  app.use(morgan("combined", { stream: accessLogStream }));
  app.use(async (req, res, next) => {
    console.log(req.query)
    next()
  });

  app.use(await featuresExegesisInstance());
  const server = http.createServer(app);
  return server;
}

createServer()
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

export { serverConfig };
