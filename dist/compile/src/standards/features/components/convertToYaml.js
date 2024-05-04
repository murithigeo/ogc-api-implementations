"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = __importDefault(require("js-yaml"));
async function convertJsonToYAML(doc) {
    //Disallow long text from being appended with >-
    const yamlOptions = { lineWidth: -1 };
    return js_yaml_1.default.dump(doc, yamlOptions);
}
exports.default = convertJsonToYAML;
