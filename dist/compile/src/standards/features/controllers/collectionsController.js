"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const generateJsonDocs_1 = require("../components/generateJsonDocs");
const params_1 = __importDefault(require("../components/params"));
const convertToYaml_1 = __importDefault(require("../components/convertToYaml"));
exports.getCollectionsAll = async function (context) {
    //context.res.status(200).setBody();
    const _collectionsAll = await (0, generateJsonDocs_1.genCollectionsRootDoc)(context, __1.collections_properties.collections, __1.allowed_F_values);
    switch ((await (0, params_1.default)(context)).f) {
        case "json":
            context.res
                .status(200)
                .set("content-type", "application/json")
                .setBody(_collectionsAll);
            break;
        case "yaml":
            context.res
                .status(200)
                .set("content-type", "text/yaml")
                .setBody(await (0, convertToYaml_1.default)(_collectionsAll));
            break;
        default:
            context.res.status(400);
    }
};
exports.getCollectionOne = async function (context) {
    const { f } = await (0, params_1.default)(context);
    console.log(context.params.path);
    const _collectionDoc = await (0, generateJsonDocs_1.genOneCollectionDoc)(context, __1.allowed_F_values, __1.collections_properties.collections.find((collection) => (collection.collectionId = context.params.path.collectionId)), "specific");
    switch (f) {
        case "yaml":
            context.res
                .status(200)
                .set("content-type", "text/yaml")
                .setBody(await (0, convertToYaml_1.default)(_collectionDoc));
            break;
        case "json":
            context.res.status(200).json(_collectionDoc);
            break;
        default:
            context.res.status(400).setBody(context.makeValidationError("Invalid f param", {
                in: "query",
                name: "f",
                docPath: context.api.pathItemPtr,
            }));
    }
};
