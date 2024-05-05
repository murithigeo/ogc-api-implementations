"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_crs_string = void 0;
var __1 = require("../");
function validate_crs_string(crsuri) {
    return __awaiter(this, void 0, void 0, function () {
        var validCrs;
        return __generator(this, function (_a) {
            validCrs = __1._allCrsProperties.find(function (crsProp) { return crsProp.uri === crsuri; });
            return [2 /*return*/, validCrs];
        });
    });
}
exports.validate_crs_string = validate_crs_string;
function crs_param_init(context) {
    return __awaiter(this, void 0, void 0, function () {
        var crsparamstring;
        return __generator(this, function (_a) {
            crsparamstring = context.params.query.crs
                ? context.params.query.crs
                : __1._allCrsProperties
                    .map(function (crs) { return crs.uri; })
                    .filter(function (crsuri) { return crsuri === (__1.crs84Uri || __1.crs84hUri); });
            return [2 /*return*/, crsparamstring];
        });
    });
}
function bboxcrs_param_init(context) {
    return __awaiter(this, void 0, void 0, function () {
        var bboxcrsstring;
        return __generator(this, function (_a) {
            bboxcrsstring = context.params.query["bbox-crs"]
                ? context.params.query["bbox-crs"]
                : __1._allCrsProperties
                    .map(function (crs) { return crs.uri; })
                    .filter(function (crsuri) { return crsuri === (__1.crs84Uri || __1.crs84hUri); });
            return [2 /*return*/, bboxcrsstring];
        });
    });
}
/**
 * Validates the coordinate parameters in the given Exegesis context.
 * @param context - The Exegesis context.
 * @returns A promise that resolves to an object containing the validated coordinate parameters.
 */
function coordParams_validate(context) {
    return __awaiter(this, void 0, void 0, function () {
        var reqBboxcrs, _a, reqCrs, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = validate_crs_string;
                    return [4 /*yield*/, bboxcrs_param_init(context)];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
                case 2:
                    reqBboxcrs = _c.sent();
                    _b = validate_crs_string;
                    return [4 /*yield*/, crs_param_init(context)];
                case 3: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
                case 4:
                    reqCrs = _c.sent();
                    //console.log(await validate_crs_string(await crs_param_init(context)))
                    //Since crs is validated precontroller
                    //crs_vArray.length > 1 &&
                    return [2 /*return*/, { reqBboxcrs: reqBboxcrs, reqCrs: reqCrs }];
            }
        });
    });
}
/**
 * Initializes the bbox parameter based on the context and validates the coordinate parameters.
 * @param context - The ExegesisContext object.
 * @returns A Promise that resolves to either bbox_w_height or bbox_wo_height.
 */
function bbox_param_init(context) {
    return __awaiter(this, void 0, void 0, function () {
        var reqBboxcrs, bboxArray, bboxParam;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, coordParams_validate(context)];
                case 1:
                    reqBboxcrs = (_a.sent()).reqBboxcrs;
                    if (context.params.query.bbox) {
                        bboxParam = context.params.query.bbox;
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
                    return [2 /*return*/, bboxArray];
            }
        });
    });
}
function contentcrsheader_header_init(crs_vArray) {
    return __awaiter(this, void 0, void 0, function () {
        var contentcrsheader;
        return __generator(this, function (_a) {
            contentcrsheader = 
            //Since crs is validated before controller
            //crs_vArray.length > 0 ?
            "<".concat(crs_vArray.uri, ">");
            return [2 /*return*/, contentcrsheader];
        });
    });
}
function limitoffset_param_init(context) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, offset, nextPageOffset, prevPageOffset;
        return __generator(this, function (_a) {
            limit = context.params.query.limit === undefined ? 100 : context.params.query.limit;
            offset = context.params.query.offset === undefined || context.params.query.offset < 0
                ? 0
                : context.params.query.offset;
            nextPageOffset = offset + limit;
            prevPageOffset = offset - limit;
            if (prevPageOffset < 0) {
                prevPageOffset = 0;
            }
            return [2 /*return*/, { offset: offset, limit: limit, prevPageOffset: prevPageOffset, nextPageOffset: nextPageOffset }];
        });
    });
}
/**
 * @function requestPathUrl generates the current url to the endpoint requested
 */
function requestPathUrl(context) {
    return __awaiter(this, void 0, void 0, function () {
        var urlString, _i, _a, _b, k, v;
        return __generator(this, function (_c) {
            urlString = new URL(context.api.serverObject.url + context.req.url.replace("/features", ""));
            //console.log(context.api.serverObject.url)
            //console.log(context.req.url)
            //Remove query paramaters
            urlString.search = "";
            /**
             * The query parameters listed in @var context.req.url pathname are incomplete. Since exegesis actually lists the defaults at @var context.params.query, then use that interface
             */
            for (_i = 0, _a = Object.entries(context.params.query); _i < _a.length; _i++) {
                _b = _a[_i], k = _b[0], v = _b[1];
                if (v) {
                    urlString.searchParams.set(k, v);
                }
            }
            return [2 /*return*/, urlString];
        });
    });
}
function f_param_init(context) {
    return __awaiter(this, void 0, void 0, function () {
        var fparamstring;
        return __generator(this, function (_a) {
            fparamstring = context.params.query.f
                ? context.params.query.f
                : "json";
            return [2 /*return*/, fparamstring];
        });
    });
}
function initCommonQueryParams(context) {
    return __awaiter(this, void 0, void 0, function () {
        var reqCrs, _a, contentcrsHeader, _b, bboxArray, _c, reqBboxcrs, _d, _e, nextPageOffset, prevPageOffset, limit, offset, f, urlToThisEP;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!context.params.query.crs) return [3 /*break*/, 2];
                    return [4 /*yield*/, coordParams_validate(context)];
                case 1:
                    _a = (_f.sent()).reqCrs;
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _f.label = 3;
                case 3:
                    reqCrs = _a;
                    if (!context.params.query.crs) return [3 /*break*/, 5];
                    return [4 /*yield*/, contentcrsheader_header_init(reqCrs)];
                case 4:
                    _b = _f.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = undefined;
                    _f.label = 6;
                case 6:
                    contentcrsHeader = _b;
                    if (!context.params.query.bbox) return [3 /*break*/, 8];
                    return [4 /*yield*/, bbox_param_init(context)];
                case 7:
                    _c = _f.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _c = undefined;
                    _f.label = 9;
                case 9:
                    bboxArray = _c;
                    if (!context.params.query["bbox-crs"]) return [3 /*break*/, 11];
                    return [4 /*yield*/, coordParams_validate(context)];
                case 10:
                    _d = (_f.sent()).reqBboxcrs;
                    return [3 /*break*/, 12];
                case 11:
                    _d = undefined;
                    _f.label = 12;
                case 12:
                    reqBboxcrs = _d;
                    return [4 /*yield*/, limitoffset_param_init(context)];
                case 13:
                    _e = _f.sent(), nextPageOffset = _e.nextPageOffset, prevPageOffset = _e.prevPageOffset, limit = _e.limit, offset = _e.offset;
                    return [4 /*yield*/, f_param_init(context)];
                case 14:
                    f = _f.sent();
                    return [4 /*yield*/, requestPathUrl(context)];
                case 15:
                    urlToThisEP = _f.sent();
                    //console.log(urlToThisEP)
                    //const unexpectedParamsRes = await validateQueryParams(context);
                    //const invalidcrsbboxRes = await invalCrsRes(context);
                    return [2 /*return*/, {
                            //invalidcrsbboxRes,
                            //unexpectedParamsRes,
                            contentcrsHeader: contentcrsHeader,
                            bboxArray: bboxArray,
                            reqCrs: reqCrs,
                            reqBboxcrs: reqBboxcrs,
                            nextPageOffset: nextPageOffset,
                            limit: limit,
                            f: f,
                            offset: offset,
                            prevPageOffset: prevPageOffset,
                            urlToThisEP: urlToThisEP,
                        }];
            }
        });
    });
}
exports.default = initCommonQueryParams;
