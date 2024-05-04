"use strict";
/**
 * This file contains functions to compile several other documents into what is required by the endpoint
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genCollectionsRootDoc = exports.genOneCollectionDoc = exports.genConformance = exports.genFeatureCollection = exports.genRootDoc = exports.genFeature = void 0;
const links_1 = require("./links");
const params_1 = __importDefault(require("./params"));
const __1 = require("..");
const db_queries_1 = require("./db_queries");
const __2 = require("../");
async function numMatchedInit(count, offset, limit) {
    let numberMatched = 0;
    const startIndex = Math.min(offset, count);
    const endIndex = Math.min(startIndex + limit, count);
    numberMatched += endIndex - startIndex;
    return numberMatched;
}
async function genFeatureCollection(context, featuresArray, count, allowed_f_values) {
    //In order to reduce complexity in generating links (rel=(next|prev)), just remove link obj where hasNextPage|prev=false
    let links = await (0, links_1.genLinksAll)(context, allowed_f_values, "Items");
    const { offset, limit } = await (0, params_1.default)(context);
    let hasNextPage, hasPrevPage;
    hasPrevPage = offset < 1 || limit - offset <= 1 ? false : true;
    hasNextPage = offset < 1 || offset - limit <= 1 ? false : true;
    if (hasNextPage === false) {
        links = links.filter((obj) => obj.rel !== "next");
    }
    if (hasPrevPage === false) {
        links = links.filter((obj) => obj.rel !== "prev");
    }
    return {
        type: "FeatureCollection",
        timeStamp: new Date().toJSON(),
        numberReturned: featuresArray.length,
        numberMatched: await numMatchedInit(count, offset, limit),
        features: featuresArray,
        links: links,
    };
}
exports.genFeatureCollection = genFeatureCollection;
async function genConformance(context, conformanceClasses, allowed_f_values) {
    return {
        conformsTo: conformanceClasses,
        links: await (0, links_1.genLinksAll)(context, allowed_f_values, "Conformance"),
    };
}
exports.genConformance = genConformance;
async function genRootDoc(context, allowed_f_values) {
    const doc = {
        title: "Root of the features implementation instance",
        links: await (0, links_1.genLinksAll)(context, allowed_f_values, "Root"),
    };
    return doc;
}
exports.genRootDoc = genRootDoc;
async function genOneCollectionDoc(context, allowed_f_values, collectionOptions, mode) {
    let _extent_bbox = await (0, db_queries_1.querySpatialExtent)(collectionOptions.modelName, collectionOptions.bboxgenScope);
    //Since the ETS does not support 6-coodinate bbox, remove the Z-axis vals
    if (_extent_bbox[0].length > 4) {
        _extent_bbox[0].splice(2, 1); //Remove Zmin
        _extent_bbox[0].splice(4, 1); //Remove Zmax
    }
    const _extent_interval = await (0, db_queries_1.queryTemporalIntervals)(collectionOptions.modelName, collectionOptions.datetimeColumns);
    return {
        id: collectionOptions.collectionId,
        description: collectionOptions.description,
        title: collectionOptions.title,
        extent: {
            spatial: {
                bbox: _extent_bbox,
                crs: _extent_bbox[0].length === 4 ? __2.crs84Uri : __2.crs84hUri, //crs84Uri : crs84hUri,
            },
            temporal: {
                interval: _extent_interval,
                trs: __2.trs,
            },
        },
        crs: _extent_bbox[0].length === 4
            ? [
                __2.crs84Uri,
                __2.crs84hUri,
                ...__1._allsupportedcrsUris.filter((string) => string !== __2.crs84Uri && string !== __2.crs84hUri),
            ]
            : [
                //Remove CRS84h from list of allowed CRS because it does not allow 6-element bbox queries
                __2.crs84Uri,
                __2.crs84hUri,
                ...__1._allsupportedcrsUris.filter((string) => string !== __2.crs84hUri && string !== __2.crs84Uri),
            ],
        itemType: "feature",
        //Alter the ternary operator to achieve get CRS84 no matter what
        storageCrs: _extent_bbox[0].length > 4 ? __2.crs84hUri : __2.crs84hUri,
        links: mode === "specific"
            ? await (0, links_1.genLinksAll)(context, allowed_f_values, "Collection")
            : await (0, links_1.genLinksToColl_ItemsWhenAtRoot)(context, collectionOptions.collectionId, allowed_f_values),
    };
}
exports.genOneCollectionDoc = genOneCollectionDoc;
async function genCollectionsRootDoc(context, collections, allowed_F_values) {
    const _allCollections = [];
    for (const collectionOption of collections) {
        _allCollections.push(await genOneCollectionDoc(context, allowed_F_values, collectionOption, "root"));
    }
    return {
        title: "All collections",
        collections: _allCollections,
        links: await (0, links_1.genLinksAll)(context, allowed_F_values, "collectionsRoot"),
    };
}
exports.genCollectionsRootDoc = genCollectionsRootDoc;
async function genFeature(context, feature, allowed_f_values) {
    feature.links = await (0, links_1.genLinksAll)(context, allowed_f_values, "Feature");
    return feature;
}
exports.genFeature = genFeature;
