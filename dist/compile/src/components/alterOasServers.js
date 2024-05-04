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
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("os"));
const server_1 = require("../server");
async function alterServers(servers, standard) {
    if (process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test") {
        //Must be connected to a LAN/Internet for this to work. If not connected, ip will be zero and therefore invalid
        var ifaces = os.networkInterfaces();
        var ips = 0;
        Object.keys(ifaces).forEach((dev) => {
            if (!dev.toLowerCase().includes("wsl")) {
                // Filter out WSL interfaces
                ifaces[dev].forEach((details) => {
                    if (details.family === "IPv4" && !details.internal) {
                        ips = details.address;
                    }
                });
            }
        });
        if (ips !== 0) {
            servers.push({
                url: `http://${ips}:${server_1.PORT}/${standard}`,
                description: `This is the internal IP address of the localmachine`,
            });
        }
        //Only use localhost on development environment otherwise during tests, TeamEngine will throw error
        if (process.env.NODE_ENV === "development") {
            servers.push({
                url: `http://localhost:${server_1.PORT}/${standard}`,
                description: "Localhost",
            });
        }
    }
    if (process.env.NODE_ENV === "production") {
        if (process.env.PROD_URL && process.env.PORT) {
            servers.push({
                url: `${process.env.PROD_URL}:${process.env.PORT}/${standard}`,
                description: `Production server`,
            });
        }
    }
    for (const serverObj of servers) {
        if (!URL.canParse(serverObj.url)) {
            console.log("Please provide standardized URLs");
            process.exit(1);
        }
    }
    return servers;
}
exports.default = alterServers;
