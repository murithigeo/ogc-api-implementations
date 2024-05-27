import { ExegesisContext, ExegesisResponse } from "exegesis-express";
import * as crsDetails from "../../components/crsdetails"
import { CN_Value, Crs_prop, F_AssociatedType } from "../../../types";

export async function validate_crs_string(crsuri: string): Promise<Crs_prop> {
  const validCrs = crsDetails._allCrsProperties.find((crsProp) => crsProp.crs === crsuri);
  return validCrs;
}

async function crs_param_init(ctx: ExegesisContext): Promise<string> {
  const crsparamstring: string = ctx.params.query.crs
    ? ctx.params.query.crs
    : crsDetails._allCrsProperties
        .map((crs) => crs.crs)
        .filter((crsuri) => crsuri === (crsDetails.crs84Uri || crsDetails.crs84hUri));
  return crsparamstring;
}

async function bboxcrs_param_init(ctx: ExegesisContext): Promise<string> {
  const bboxcrsstring: string = ctx.params.query["bbox-crs"]
    ? ctx.params.query["bbox-crs"]
    : crsDetails._allCrsProperties
        .map((crs) => crs.crs)
        .filter((crsuri) => crsuri === (crsDetails.crs84Uri || crsDetails.crs84hUri));
  return bboxcrsstring;
}

/**
 * Validates the coordinate parameters in the given Exegesis ctx.
 * @param ctx - The Exegesis ctx.
 * @returns A promise that resolves to an object containing the validated coordinate parameters.
 */
async function coordParams_validate(ctx: ExegesisContext): Promise<{
  //flipCoords: boolean;  Since IsGeographic===flipCoords,
  reqCrs: Crs_prop;
  reqBboxcrs: Crs_prop;
}> {
  const reqBboxcrs = await validate_crs_string(
    await bboxcrs_param_init(ctx)
  );

  const reqCrs = await validate_crs_string(await crs_param_init(ctx));


  //Since crs is validated precontroller
  //crs_vArray.length > 1 &&

  return { reqBboxcrs, reqCrs };
}

type bbox_w_height = [number, number, number, number, number, number];
type bbox_wo_height = [number, number, number, number];

/**
 * Initializes the bbox parameter based on the ctx and validates the coordinate parameters.
 * @param ctx - The ExegesisContext object.
 * @returns A Promise that resolves to either bbox_w_height or bbox_wo_height.
 */
async function bbox_param_init(
  ctx: ExegesisContext
): Promise<bbox_w_height | bbox_wo_height> {
  const { reqBboxcrs } = await coordParams_validate(ctx);
  let bboxArray: bbox_w_height | bbox_wo_height;
  if (ctx.params.query.bbox) {
    const bboxParam = ctx.params.query.bbox;
    //Depreciated because invalid crs errors are controlled using the the invalid crs plugin
    //TODO: Each standard instance should have its own allowed crsArray
    // if (bboxcrs_vArray.length > 0) {
    if (reqBboxcrs.crs === crsDetails.crs84hUri && bboxParam.length > 4) {
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
    `<${crs_vArray.crs}>`;
  return contentcrsheader;
}

async function limitoffset_param_init(ctx: ExegesisContext): Promise<{
  offset: number;
  limit: number;
  prevPageOffset: number;
  nextPageOffset: number;
}> {
  const limit: number =
    ctx.params.query.limit === undefined ? 100 : ctx.params.query.limit;

  const offset: number =
    ctx.params.query.offset === undefined || ctx.params.query.offset < 0
      ? 0
      : ctx.params.query.offset;
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
async function requestPathUrl(ctx: ExegesisContext): Promise<URL> {
  /**
   * @ctx.api.serverObject is the server against which the request was run
   * @ctx.req.uri is the pathname
   */
  const urlString = new URL(
    ctx.api.serverObject.url + ctx.req.url.replace("/features", "")
  );
  //console.log(urlString);
  //console.log(ctx.api.serverObject.url)
  //console.log(ctx.req.url)
  //Remove query paramaters
  urlString.search = "";

  /**
   * The query parameters listed in @var ctx.req.url pathname are incomplete. Since exegesis actually lists the defaults at @var ctx.params.query, then use that interface
   */
  for (const [k, v] of Object.entries(ctx.params.query)) {
    if (v) {
      urlString.searchParams.set(k, v);
    }
  }
  return urlString;
}
async function f_param_init(ctx: ExegesisContext): Promise<CN_Value> {
  const fparamstring: CN_Value = ctx.params.query.f
    ? ctx.params.query.f
    : "json";
  return fparamstring;
}

export default async function initCommonQueryParams(
  ctx: ExegesisContext
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
  const reqCrs = ctx.params.query.crs
    ? (await coordParams_validate(ctx)).reqCrs
    : undefined;
  const contentcrsHeader = ctx.params.query.crs
    ? await contentcrsheader_header_init(reqCrs)
    : undefined;

  const bboxArray = ctx.params.query.bbox
    ? await bbox_param_init(ctx)
    : undefined;
  const reqBboxcrs = ctx.params.query["bbox-crs"]
    ? (await coordParams_validate(ctx)).reqBboxcrs
    : undefined;

  const { nextPageOffset, prevPageOffset, limit, offset } =
    await limitoffset_param_init(ctx);
  const f = await f_param_init(ctx);
  const urlToThisEP = await requestPathUrl(ctx);

  //console.log(urlToThisEP)
  //const unexpectedParamsRes = await validateQueryParams(ctx);
  //const invalidcrsbboxRes = await invalCrsRes(ctx);
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
