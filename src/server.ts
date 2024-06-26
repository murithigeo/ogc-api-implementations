import express from "express";
import cors from 'cors';
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

//let servers: oasDocServers[] = [];

//Environmental Variables
const PORT: number = parseInt(<string>process.env.PORT) || 443; //Default port

export { PORT };
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

  //app.set("trust proxy", true);

  app.use(cors());
  app.use((req, res, next) => {
    //Decode the url because exegesis may fail to decode some. Especially the bbox parameter
    //console.log("b4", req.headers["x-forwarded-proto"]);
    //req.headers["x-forwarded-proto"] = "https";
    //console.log("after_main", req.protocol);
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
  app.use(await featuresExegesisInstance());
  const server = http.createServer(app);

  return server;
}

createServer()
  .then((server) => {
    server.listen(PORT, () => {
      console.log("Server listening on: ", PORT, server.listening);
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
