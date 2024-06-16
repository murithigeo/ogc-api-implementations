import { Length } from "convert";
import * as crsDetails from "./crsdetails";
import { ExegesisContext } from "exegesis-express";
import { CrsDetail } from "../types";
import { CN_Value } from "../../types";
import { CNValueNew } from "./contentNegotiation";

/**
 * @function edrCommonParams A function used to get common variables from the exegesis interfaces
 */

const commonParams = async (ctx: ExegesisContext) => {
  const bboxVals = await validateBboxParam(
    ctx.params.query["bbox-crs"] ?? ctx.params.query.crs,
    ctx.params.query.bbox
  );
  const crs = await crsParamInit(ctx.params.query.crs);

  return {
    crs,
    xyAxisBbox: ctx.params.query.bbox ? bboxVals.xyAxisBbox : undefined,
    zAxisBbox:
      ctx.params.query.bbox && ctx.params.query.bbox.length > 4
        ? bboxVals.zAxisBbox
        : undefined,
    _url: await reqUriGen(ctx),
    limit: await limitParamInit(ctx.params.query.limit),
    offset: await offsetParamInit(ctx.params.query.offset),
    bboxcrs: await crsParamInit(ctx.params.query["bbox-crs"]),
    parameter_names: await parameter_namesParamInit(
      ctx.params.query["parameter-name"]
    ),
    coords: await parsedCoordsParam(ctx.params.query.parsedcoords),
    instanceId: await instanceIdParamInit(ctx.params.path.instanceId),
    instanceMode: await instanceModeParamInit(ctx.params.query.instancemode),
    collectionId: await collectionIdParamInit(ctx.params.path.collectionId),
    locationId: await locationIdParamInit(ctx.params.path.locationId),
    itemId: await itemIdParamInit(ctx.params.path.itemId),
    height_units: await heightUnitsParamInit(ctx.params.query["height-units"]),
    corridor_height: await corridorHeightParamInit(
      ctx.params.query["corridor-height"]
    ),
    width_units: await widthUnitsParamInit(ctx.params.query["width-units"]),
    corridor_width: await corridorWidthParamInit(
      ctx.params.query["corridor-width"]
    ),
    resolutionX: await resolutionXParamInit(ctx.params.query["resolution-x"]),
    resolutionY: await resolutionYParamInit(ctx.params.query["resolution-y"]),
    resolutionZ: await resolutionZParamInit(ctx.params.query["resolution-z"]),
    within_units: await withinUnitsParamInit(ctx.params.query["within-units"]),
    within: await withinParamInit(ctx.params.query.within),
    //cubeZ: await cubeZParamInit(ctx),
    z: await parsedZparam(ctx.params.query.parsedz),
    datetime: await parsedDatetimeParam(ctx.params.query.parseddatetime),
    f: await fParamInit(ctx.params.query.parsedf),
    contentcrsHeader: await contentcrsHeader(crs),
    //datetime: await datetimeParamInit(ctx),
    //f: await fParamInit(ctx),
  };
};
export default commonParams;

export const fParamInit = async (param: CNValueNew) =>
  param ?? undefined;

export const contentcrsHeader = async (crs: CrsDetail) => `<${crs.crs}>`;
const coordsParamInit_unparsed = async (ctx: ExegesisContext) =>
  (ctx.params.query.coords as string) ?? undefined;

const parsedCoordsParam = async (param: {
  zmin: null | number;
  zmax: null | number;
  mmin: string | null;
  mmax: string | null;
  coords2d: string;
}) => param ?? undefined;
export const validateCrsUri = async (uri: string) =>
  crsDetails._allCrsProperties.find((crsDet) => crsDet.crs === uri);

const crsParamInit = async (param: string | undefined) =>
  (await validateCrsUri(param)) ??
  (await validateCrsUri(crsDetails.crs84Uri || crsDetails.crs84hUri));

const bboxCrsParamInit = async (param: string | undefined) =>
  (await validateCrsUri(param)) ??
  (await validateCrsUri(crsDetails.crs84Uri || crsDetails.crs84hUri));

export const validateBboxParam = async (
  bboxCrs: CrsDetail,
  bboxParam: number[]
) => {
  //const unsortedBbboxArray = await bboxParamInit(ctx);
  //const bboxCrs = await bboxCrsParamInit(ctx);
  let xyAxisBbox: [number, number, number, number] | undefined;
  let zAxisBbox: [number, number] | undefined;
  if (bboxParam === undefined) {
    xyAxisBbox = undefined;
    return;
  } else {
    if (bboxCrs.isGeographic === true) {
      if (bboxParam.length > 4) {
        xyAxisBbox = [
          bboxParam[1],
          bboxParam[0],
          bboxParam[4],
          bboxParam[3],
          //maxz
        ];
        zAxisBbox = [bboxParam[2], bboxParam[5]]; //minz
      } else {
        xyAxisBbox = [bboxParam[1], bboxParam[0], bboxParam[3], bboxParam[2]];
        zAxisBbox = undefined;
      }
    } else {
      if (bboxParam.length > 4) {
        xyAxisBbox = [
          bboxParam[0],
          bboxParam[1],
          bboxParam[3],
          bboxParam[4],
          //maxz
        ];
        zAxisBbox = [bboxParam[2], bboxParam[5]]; //minz
      } else {
        xyAxisBbox = [bboxParam[0], bboxParam[1], bboxParam[2], bboxParam[3]];
      }
    }
  }
  return { xyAxisBbox, zAxisBbox } || undefined;
};

//const functionToUseForItemsInBoundingBox=async(ctx:ExegesisContext)=>{}
const parameter_namesParamInit = async (param: string | undefined) =>
  param ? (param.split(",") as Array<string>) : undefined;

const reqUriGen = async (ctx: ExegesisContext) => {
  //Replace is used because of the current pathnames.
  //For instance, since the served is hosted on domain.com/{standardName} and the req.url=/{standardName}/
  // This results in the duplication of "/{standardName}"
  const url = new URL(
    ctx.api.serverObject.url + ctx.req.url //.replace("/edr", "")
  );

  if (
    ctx.req.url.startsWith("/edr") &&
    ctx.api.serverObject.url.endsWith("/edr")
  ) {
    url.pathname.replace("/edr", "");
  }
  //Band aid
  if (
    ctx.req.url.startsWith("/features") &&
    ctx.api.serverObject.url.endsWith("/features")
  ) {
    url.pathname.replace("/features", "");
  }
  //if(url.pathname.split("/").)
  //Remove search strings because it includes undocumented params and does not include oas param defaults
  url.search = "";

  //Add params listed on oas doc
  for (const [k, v] of Object.entries(ctx.params.query)) {
    //console.log("k: ",k, "v: ",v)
    if (
      v &&
      k !== "parsedcoords" &&
      k !== "parsedz" &&
      k !== "parseddatetime"
    ) {
      url.searchParams.set(k, v);
    }
  }
  return url;
};

export const limitParamInit = async (
  param: number | undefined
): Promise<number> => (param || param === 0 ? param : 100);

export const offsetParamInit = async (
  param: number | undefined
): Promise<number> => (param || param === 0 ? param : 0);

/**
 * @function instanceModeParamInit not really necessary considering its required by exegesis and it has a default
 */
export const instanceModeParamInit = async (
  param: "country" | "subregion" | undefined
): Promise<string> => param ?? "subregion";

const collectionIdParamInit = async (param: string | undefined) =>
  param ?? undefined;

const instanceIdParamInit = async (param: string | undefined) =>
  param ?? undefined;

const locationIdParamInit = async (param: string | undefined) =>
  param ?? undefined;

const itemIdParamInit = async (param: string | undefined) => param ?? undefined;

/**
 * @param ctx.params.query["height-units"]
 */
const heightUnitsParamInit = async (param: Length | undefined) =>
  //ctx.params.query["height-units"]
  param ?? undefined;

/**
 * @param ctx.params.query["corridor-height"]
 */
const corridorHeightParamInit = async (param: number | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query["width-units"]
 * @returns Length | undefined
 */
export const widthUnitsParamInit = async (param: Length | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query["corridor-width"]
 * @returns
 */
const corridorWidthParamInit = async (param: number | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query["resolution-z"]
 * @returns
 */
const resolutionZParamInit = async (param: number | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query["resolution-x"]
 * @returns
 */
const resolutionXParamInit = async (param: number | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query["resolution-y"]
 * @returns
 */
const resolutionYParamInit = async (param: number | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query["width-units"]
 * @returns
 */
const withinUnitsParamInit = async (param: Length | undefined) =>
  param ?? undefined;

/**
 *
 * @param ctx.params.query.within
 * @returns
 */
const withinParamInit = async (param: number | undefined) => param ?? undefined;

const zParamInit_unparsed = async (ctx: ExegesisContext) =>
  ctx.params.query.z ? (ctx.params.query.z as string) : undefined;

/**
 *
 * @param ctx.params.query.parsedz
 * @returns
 */
const parsedZparam = async (
  param:
    | {
        min: number | undefined;
        max: number | undefined;
        in: number[] | undefined;
        one: number | undefined;
        //incrementBy: number | undefined;
        //intervalNumber: number | undefined;
      }
    | undefined
) => param ?? undefined;

//TO DO
const datetimeParamInit_unparsed = async (ctx: ExegesisContext) => {
  return ctx.params.query.datetime
    ? (ctx.params.query.datetime as string)
    : undefined;
};

const parsedDatetimeParam = async (
  param:
    | {
        start: string | undefined;
        end: string | undefined;
        one: string | undefined;
      }
    | undefined
) => param ?? undefined;
/** */
/*
const fParamInit = async (ctx: ExegesisContext) => {
  if (ctx.params.query.f) {
    if (
      index.allowedFValues.length > 0 &&
      !index.allowedFValues.includes(ctx.params.query.f)
    ) {
      ctx.res
        .status(400)
        .json(await makeQueryValidationError(ctx, "f"))
        .end();
      return;
    }
  }

  return ctx.params.query.f as string | undefined;
  
};

*/
