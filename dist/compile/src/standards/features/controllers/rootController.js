"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const params_1 = __importDefault(require("../components/params"));
const generateJsonDocs_1 = require("../components/generateJsonDocs");
const convertToYaml_1 = __importDefault(require("../components/convertToYaml"));
const __1 = require("..");
exports.getLandingPage = async function (context) {
    const { f } = await (0, params_1.default)(context);
    const _jsonDoc = await (0, generateJsonDocs_1.genRootDoc)(context, __1.allowed_F_values);
    switch (f) {
        case "json":
            context.res
                .status(200)
                .set("content-type", "application/json")
                .setBody(_jsonDoc);
            break;
        case "yaml":
            context.res
                .status(200)
                .set("content-type", "text/yaml")
                .setBody(await (0, convertToYaml_1.default)(_jsonDoc));
            break;
        default:
            context.res.status(400).setBody('t');
    }
};
