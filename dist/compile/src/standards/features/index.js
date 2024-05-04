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
exports.trs = exports.crs84hUri = exports.crs84Uri = exports.allowed_F_values = exports.collections_properties = exports._allsupportedcrsUris = exports._allCrsProperties = exports.featuresOasDoc = void 0;
const exegesisExpress = __importStar(require("exegesis-express"));
const parseOasDoc_1 = __importDefault(require("../../components/parseOasDoc"));
const server_1 = require("../../server");
const exegesis_plugin_validateRequests_1 = __importDefault(require("./plugins/exegesis-plugin-validateRequests"));
//The mandated defaults
const crs84Uri = "http://www.opengis.net/def/crs/OGC/1.3/CRS84";
exports.crs84Uri = crs84Uri;
const crs84hUri = "http://www.opengis.net/def/crs/OGC/0/CRS84h";
exports.crs84hUri = crs84hUri;
const _allCrsProperties = [
    {
        authority: "OGC",
        version: 1.3,
        code: "CRS84",
        srid: 4326,
        //auth_name: 'OGC',
        isGeographic: false,
        //uri: `http://www.opengis.net/def/crs/${authority}/${version}/${code}`
    },
    {
        code: 4326,
        version: 0,
        srid: 4326,
        authority: "EPSG",
        isGeographic: true,
    },
    {
        authority: "OGC",
        srid: 4326,
        version: 0,
        isGeographic: false,
        code: "CRS84h",
    },
];
exports._allCrsProperties = _allCrsProperties;
//Create uris pointing to the schema
for (const crsObject of _allCrsProperties) {
    crsObject.uri = `http://www.opengis.net/def/crs/${crsObject.authority}/${crsObject.version}/${crsObject.code}`;
}
/**
 * Generate a string[] for the above CRS comprised of the uri attribute.
 */
const _allsupportedcrsUris = _allCrsProperties.map((crsObject) => crsObject.uri);
exports._allsupportedcrsUris = _allsupportedcrsUris;
//Temporal Reference System Identifier
const trs = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";
exports.trs = trs;
//All possible content-negotiation values
const allowed_F_values = [
    {
        f: "json",
        type: "application/json", //This value will be mutated during link creation to application/geo+json when appropriate
    },
    {
        f: "yaml",
        type: "text/yaml",
    },
];
exports.allowed_F_values = allowed_F_values;
const collections_properties = {
    fallbackCrs: [crs84Uri],
    collections: [
        {
            collectionId: "mountains",
            bboxgenScope: "bboxgenScope",
            zAxis: true,
            datetimeColumns: null,
            modelName: "mountains",
            supportedCrs: ["http://www.opengis.net/def/crs/EPSG/0/4326"],
        },
    ],
};
exports.collections_properties = collections_properties;
exports.featuresOasDoc = (0, parseOasDoc_1.default)('./src/standards/features/index.yaml', "features");
async function featuresExegesisInstance() {
    //globalexegesisOptions.controllers = path.resolve(__dirname, "./controllers");
    server_1.globalexegesisOptions.plugins = [
        (0, exegesis_plugin_validateRequests_1.default)(allowed_F_values.map((opt) => opt.f), ["apiKey"], //Used for auth but is not listed by the queryParams Interface
        //Generate a list of collections
        collections_properties.collections.map((collection) => collection.collectionId)),
    ];
    return exegesisExpress.middleware(await exports.featuresOasDoc, server_1.globalexegesisOptions);
    //return exegesisInstance;
}
exports.default = featuresExegesisInstance;
