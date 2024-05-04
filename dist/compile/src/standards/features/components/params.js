"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_crs_string = void 0;
const __1 = require("../");
async function validate_crs_string(crsuri) {
    const validCrs = __1._allCrsProperties.find((crsProp) => crsProp.uri === crsuri);
    return validCrs;
}
exports.validate_crs_string = validate_crs_string;
async function crs_param_init(context) {
    const crsparamstring = context.params.query.crs
        ? context.params.query.crs
        : __1._allCrsProperties
            .map((crs) => crs.uri)
            .filter((crsuri) => crsuri === (__1.crs84Uri || __1.crs84hUri));
    return crsparamstring;
}
async function bboxcrs_param_init(context) {
    const bboxcrsstring = context.params.query["bbox-crs"]
        ? context.params.query["bbox-crs"]
        : __1._allCrsProperties
            .map((crs) => crs.uri)
            .filter((crsuri) => crsuri === (__1.crs84Uri || __1.crs84hUri));
    return bboxcrsstring;
}
/**
 * Validates the coordinate parameters in the given Exegesis context.
 * @param context - The Exegesis context.
 * @returns A promise that resolves to an object containing the validated coordinate parameters.
 */
async function coordParams_validate(context) {
    const reqBboxcrs = await validate_crs_string(await bboxcrs_param_init(context));
    const reqCrs = await validate_crs_string(await crs_param_init(context));
    //console.log(await validate_crs_string(await crs_param_init(context)))
    //Since crs is validated precontroller
    //crs_vArray.length > 1 &&
    return { reqBboxcrs, reqCrs };
}
/**
 * Initializes the bbox parameter based on the context and validates the coordinate parameters.
 * @param context - The ExegesisContext object.
 * @returns A Promise that resolves to either bbox_w_height or bbox_wo_height.
 */
async function bbox_param_init(context) {
    const { reqBboxcrs } = await coordParams_validate(context);
    let bboxArray;
    if (context.params.query.bbox) {
        const bboxParam = context.params.query.bbox;
        //Depreciated because invalid crs errors are controlled using the the invalid crs plugin
        //TODO: Each standard instance should have its own allowed crsArray
        // if (bboxcrs_vArray.length > 0) {
        if (reqBboxcrs.uri === __1.crs84hUri && bboxParam.length > 4) {
            bboxArray = [
                bboxParam[0], //xmin
                bboxParam[1], //ymin
                bboxParam[2], //h
                bboxParam[3], //xmax
                bboxParam[4], //ymax
                bboxParam[5], //h
            ];
        }
        else {
            if (reqBboxcrs.isGeographic === false) {
                bboxArray = [bboxParam[0], bboxParam[1], bboxParam[2], bboxParam[3]];
            }
            if (reqBboxcrs.isGeographic === true) {
                bboxArray = [bboxParam[1], bboxParam[0], bboxParam[3], bboxParam[2]];
            }
        }
    }
    return bboxArray;
}
async function contentcrsheader_header_init(crs_vArray) {
    const contentcrsheader = 
    //Since crs is validated before controller
    //crs_vArray.length > 0 ?
    `<${crs_vArray.uri}>`;
    return contentcrsheader;
}
async function limitoffset_param_init(context) {
    const limit = context.params.query.limit === undefined ? 100 : context.params.query.limit;
    const offset = context.params.query.offset === undefined || context.params.query.offset < 0
        ? 0
        : context.params.query.offset;
    const nextPageOffset = offset + limit;
    let prevPageOffset = offset - limit;
    if (prevPageOffset < 0) {
        prevPageOffset = 0;
    }
    return { offset, limit, prevPageOffset, nextPageOffset };
}
/**
 * @function requestPathUrl generates the current url to the endpoint requested
 */
async function requestPathUrl(context) {
    /**
     * @context.api.serverObject is the server against which the request was run
     * @context.req.uri is the pathname
     */
    const urlString = new URL(context.api.serverObject.url + context.req.url.replace("/features", ""));
    //console.log(context.api.serverObject.url)
    //console.log(context.req.url)
    //Remove query paramaters
    urlString.search = "";
    /**
     * The query parameters listed in @var context.req.url pathname are incomplete. Since exegesis actually lists the defaults at @var context.params.query, then use that interface
     */
    for (const [k, v] of Object.entries(context.params.query)) {
        if (v) {
            urlString.searchParams.set(k, v);
        }
    }
    return urlString;
}
async function f_param_init(context) {
    const fparamstring = context.params.query.f
        ? context.params.query.f
        : "json";
    return fparamstring;
}
async function initCommonQueryParams(context) {
    const reqCrs = context.params.query.crs
        ? (await coordParams_validate(context)).reqCrs
        : undefined;
    const contentcrsHeader = context.params.query.crs
        ? await contentcrsheader_header_init(reqCrs)
        : undefined;
    const bboxArray = context.params.query.bbox
        ? await bbox_param_init(context)
        : undefined;
    const reqBboxcrs = context.params.query["bbox-crs"]
        ? (await coordParams_validate(context)).reqBboxcrs
        : undefined;
    const { nextPageOffset, prevPageOffset, limit, offset } = await limitoffset_param_init(context);
    const f = await f_param_init(context);
    const urlToThisEP = await requestPathUrl(context);
    //console.log(urlToThisEP)
    //const unexpectedParamsRes = await validateQueryParams(context);
    //const invalidcrsbboxRes = await invalCrsRes(context);
    return {
        //invalidcrsbboxRes,
        //unexpectedParamsRes,
        contentcrsHeader,
        bboxArray,
        reqCrs,
        reqBboxcrs,
        nextPageOffset,
        limit,
        f,
        offset,
        prevPageOffset,
        urlToThisEP,
    };
}
exports.default = initCommonQueryParams;
