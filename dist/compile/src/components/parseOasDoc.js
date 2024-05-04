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
const YAML = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const server_1 = require("../server");
const alterOasServers_1 = __importDefault(require("./alterOasServers"));
async function parseOasFragment(yamlFile) {
    return YAML.load(fs.readFileSync(yamlFile, "utf-8"));
}
async function parseOasDoc(yamlFile, standard) {
    let mainDoc, fragmentToParse;
    mainDoc = await parseOasFragment(path.join(process.cwd(), "./src/oas/index.yaml"));
    fragmentToParse = await parseOasFragment(path.join(process.cwd(), yamlFile));
    mainDoc.servers = await (0, alterOasServers_1.default)(server_1.servers, standard);
    if (fragmentToParse) {
        if (fragmentToParse.securitySchemes) {
            throw new Error("SecuritySchemes must be defined in src/oas/index.yaml");
        }
        if (fragmentToParse.paths) {
            mainDoc.paths = { ...mainDoc.paths, ...fragmentToParse.paths };
        }
        if (fragmentToParse.components) {
            mainDoc.components = {
                ...mainDoc.components,
                ...fragmentToParse.components,
            };
        }
    }
    return mainDoc;
}
exports.default = parseOasDoc;
