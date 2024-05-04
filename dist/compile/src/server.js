"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalexegesisOptions = exports.servers = exports.PORT = void 0;
const express_1 = __importDefault(require("express"));
//const express = require("express");
const morgan_1 = __importDefault(require("morgan"));
//const morgan = require("morgan");
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const apikeyAuth_1 = require("./authentication/apikeyAuth");
const basicAuth_1 = require("./authentication/basicAuth");
const features_1 = __importDefault(require("./standards/features"));
//This also assumes that the development occurs locally
let servers = [];
exports.servers = servers;
//Environmental Variables
const PORT = parseInt(process.env.PORT) || 3000; //Default port
exports.PORT = PORT;
exports.globalexegesisOptions = {
    controllers: path.join(__dirname, './standards/features/controllers'), //Temporary measure
    controllersPattern: "**/**/*.@(js|ts)",
    allowMissingControllers: true,
    ignoreServers: false,
    autoHandleHttpErrors: true,
    authenticators: {
        ApiKeyAuth: apikeyAuth_1.apiKeyAuthenticator,
        BasicAuth: basicAuth_1.basicAuthenticator,
    },
};
// Configure exegesis & express
async function createServer() {
    const app = (0, express_1.default)();
    app.use((req, res, next) => {
        console.log(req);
        //Decode the url because exegesis may fail to decode some. Especially the bbox parameter
        req.url = decodeURIComponent(req.url);
        next();
    });
    // Configure access log
    const accessLogStream = fs.createWriteStream(path.join(__dirname, "./logs/reqs.log"), { flags: "a" });
    app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
    console.log(exports.globalexegesisOptions.controllers);
    app.use(await (0, features_1.default)());
    const server = http.createServer(app);
    return server;
}
createServer()
    .then((server) => {
    server.listen(PORT, () => {
        for (const server of servers) {
            console.log(`LandingPage or TeamEngine Endpoint is available at ${server.url}`);
            console.log(`API documentation is available at ${server.url}/api.html`);
        }
    });
})
    .catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
