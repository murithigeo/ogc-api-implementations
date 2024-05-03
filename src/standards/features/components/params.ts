import { ExegesisContext, ExegesisResponse } from "exegesis-express";
import { crs84Uri, crs84hUri, _allCrsProperties } from "../";
import { CN_Value, Crs_prop, F_AssociatedType } from "../../../types";

export async function validate_crs_string(crsuri: string): Promise<Crs_prop> {
  const validCrs = _allCrsProperties.find(
    (crsProp) => crsProp.uri === crsuri
  );
  return validCrs;
}

async function crs_param_init(context: ExegesisContext): Promise<string> {
  const crsparamstring: string = context.params.query.crs
    ? context.params.query.crs
    : _allCrsProperties
        .map((crs) => crs.uri)
        .filter((crsuri) => crsuri === (crs84Uri || crs84hUri));
  return crsparamstring;
}

async function bboxcrs_param_init(context: ExegesisContext): Promise<string> {
  const bboxcrsstring: string = context.params.query["bbox-crs"]
    ? context.params.query["bbox-crs"]
    : _allCrsProperties
        .map((crs) => crs.uri)
        .filter((crsuri) => crsuri === (crs84Uri || crs84hUri));
  return bboxcrsstring;
}

/**
 * Validates the coordinate parameters in the given Exegesis context.
 * @param context - The Exegesis context.
 * @returns A promise that resolves to an object containing the validated coordinate parameters.
 */
async function coordParams_validate(context: ExegesisContext): Promise<{
  //flipCoords: boolean;  Since IsGeographic===flipCoords,
  reqCrs: Crs_prop;
  reqBboxcrs: Crs_prop;
}> {
  const reqBboxcrs = (
    await validate_crs_string(await bboxcrs_param_init(context))
  );

  const reqCrs = (await validate_crs_string(await crs_param_init(context)));

  //console.log(await validate_crs_string(await crs_param_init(context)))

  //Since crs is validated precontroller
  //crs_vArray.length > 1 &&

  return { reqBboxcrs, reqCrs };
}

type bbox_w_height = [number, number, number, number, number, number];
type bbox_wo_height = [number, number, number, number];

/**
 * Initializes the bbox parameter based on the context and validates the coordinate parameters.
 * @param context - The ExegesisContext object.
 * @returns A Promise that resolves to either bbox_w_height or bbox_wo_height.
 */
async function bbox_param_init(
  context: ExegesisContext
): Promise<bbox_w_height | bbox_wo_height> {
  const { reqBboxcrs } = await coordParams_validate(context);
  let bboxArray: bbox_w_height | bbox_wo_height;
  if (context.params.query.bbox) {
    const bboxParam = context.params.query.bbox;
    //Depreciated because invalid crs errors are controlled using the the invalid crs plugin
    //TODO: Each standard instance should have its own allowed crsArray
    // if (bboxcrs_vArray.length > 0) {
    if (reqBboxcrs.uri === crs84hUri) {
      bboxArray = [
        bboxParam[0], //xmin
        bboxParam[1], //ymin
        bboxParam[2], //h
        bboxParam[3], //xmax
        bboxParam[4], //ymax
        bboxParam[5], //h
      ];
    } else {
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
async function contentcrsheader_header_init(
  crs_vArray: Crs_prop
): Promise<string> {
  const contentcrsheader =
    //Since crs is validated before controller
    //crs_vArray.length > 0 ?
    `<${crs_vArray.uri}>`;
  return contentcrsheader;
}

async function limitoffset_param_init(context: ExegesisContext): Promise<{
  offset: number;
  limit: number;
  prevPageOffset: number;
  nextPageOffset: number;
}> {
  const limit: number =
    context.params.query.limit === undefined ? 100 : context.params.query.limit;

  const offset: number =
    context.params.query.offset === undefined || context.params.query.offset < 0
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
async function requestPathUrl(context: ExegesisContext): Promise<URL> {
  /**
   * @context.api.serverObject is the server against which the request was run
   * @context.req.uri is the pathname
   */
  const urlString = new URL(
    context.api.serverObject.url + context.req.url.replace("/features", "")
  );
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
async function f_param_init(context: ExegesisContext): Promise<CN_Value> {
  const fparamstring: CN_Value = context.params.query.f
    ? context.params.query.f
    : "json";
  return fparamstring;
}

export default async function initCommonQueryParams(
  context: ExegesisContext
): Promise<{
  //unexpectedParamsRes: ExegesisResponse;
  contentcrsHeader?: string;
  limit: number;
  bboxArray: bbox_w_height | bbox_wo_height;
  reqCrs: Crs_prop;
  reqBboxcrs: Crs_prop;
  nextPageOffset: number;
  prevPageOffset: number;
  offset: number;
  f: CN_Value;
  readonly urlToThisEP: URL;
  //invalidcrsbboxRes: ExegesisResponse;
}> {
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

  const { nextPageOffset, prevPageOffset, limit, offset } =
    await limitoffset_param_init(context);
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
