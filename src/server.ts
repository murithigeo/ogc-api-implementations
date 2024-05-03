import express from "express";
import morgan from "morgan";
import http from "http";
import path from "path";
import * as exegesisExpress from "exegesis-express";
import fs from "fs";
import { oasDocServers } from "./types";
import { apiKeyAuthenticator } from "./authentication/apikeyAuth";
import { basicAuthenticator } from "./authentication/basicAuth";
import featuresExegesisInstance from "./standards/features";

 //This also assumes that the development occurs locally

let servers: oasDocServers[] = [];

const PORT = parseInt(<string>process.env.PORT) || 3000;

export { PORT, servers };
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

  app.use((req, res, next) => {
    //Decode the url because exegesis may fail to decode some. Especially the bbox parameter
    req.url = decodeURIComponent(req.url);
    next();
  });
  // Configure access log
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "./logs/reqs.log"),
    { flags: "a" }
  );
  app.use(morgan("combined", { stream: accessLogStream }));

  app.use(await featuresExegesisInstance());
  const server = http.createServer(app);
  return server;
}

createServer()
  .then((server) => {
    server.listen(PORT, () => {
      for (const server of servers) {
        console.log(
          `LandingPage or TeamEngine Endpoint is available at ${server.url}`
        );
        console.log(`API documentation is available at ${server.url}/api.html`);
      }
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
