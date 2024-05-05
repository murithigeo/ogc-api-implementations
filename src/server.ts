import express from "express";
//const express = require("express");
import morgan from "morgan";
//const morgan = require("morgan");
import * as http from "http";
import * as path from "path";
import * as exegesisExpress from "exegesis-express";
import * as fs from "fs";
import { oasDocServers } from "./types";
import { apiKeyAuthenticator } from "./authentication/apikeyAuth";
import { basicAuthenticator } from "./authentication/basicAuth";
import featuresExegesisInstance from "./standards/features";
import _rootInstance from "./root";
import https from "https";
//This also assumes that the development occurs locally

let servers: oasDocServers[] = [];

//Environmental Variables
const PORT: number = parseInt(<string>process.env.PORT) || 443; //Default port
//process.env.NODE_ENV = "test" as "production" | "test" | "development"; //Set the environment
console.log(process.env.NODE_ENV);
export { PORT, servers };
export const globalexegesisOptions: exegesisExpress.ExegesisOptions = {
  //controllers: path.join(__dirname, "./standards/features/controllers"), //Temporary measure
  controllersPattern: "**/**/*.@(js|ts)",
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

  app.use((req, res, next) => {
    //console.log(`reqUrl: ${req.url}`)

    console.log(`${req.protocol}`);
    process.env.NODE_ENV === "production" ? (req.protocol = "https") : "";
    //console.log(`reqR_Path: ${JSON.stringify(req)}`)

    //console.log(req)
    //Decode the url because exegesis may fail to decode some. Especially the bbox parameter
    req.url = decodeURIComponent(req.url);
    next();
  });
  // Configure access log
  if (
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development"
  ) {
    const accessLogStream = fs.createWriteStream(
      path.join(process.cwd(), "./src/logs/reqs.log"),
      { flags: "a" }
    );
    app.use(morgan("combined", { stream: accessLogStream }));
  }

  //main instance. Services routes at server
  //Roots include listed in ./root/index.yaml
  const _mainExInstance = await _rootInstance();
  app.use(_mainExInstance);

  //Specific inst
  app.use("/features", await featuresExegesisInstance());
  const server = http.createServer(app);

  return server;
}

createServer()
  .then((server) => {
    server.listen(PORT, () => {
      console.log(server.listening);
      for (const server of servers) {
        console.log(`_serverurl: ${server.url}`);
      }
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
