import { Length } from "convert";
import * as crsDetails from "./crsdetails";
import {
  ExegesisContext,
  HttpIncomingMessage,
  ParametersByLocation,
  ParametersMap,
} from "exegesis-express";
import { CrsDetail } from "../types";
import { CN_Value } from "../../types";
import { CNValueNew } from "./contentNegotiation";

/**
 *
 * @function edrCommonParams A function used to get common variables from the exegesis interfaces
 * @param ctx.params.query
 */

const commonParams = async (ctx: ExegesisContext) => {
  const bboxVals = await validateBboxParam(ctx.params);
  const crs = await crsParamInit(ctx.params);

  return {
    crs,
    xyAxisBbox: ctx.params.query.bbox ? bboxVals.xyAxisBbox : undefined,
    zAxisBbox:
      ctx.params.query.bbox && ctx.params.query.bbox.length > 4
        ? bboxVals.zAxisBbox
        : undefined,
    _url: await reqUriGen(ctx.api.serverObject, ctx.req, ctx.params),
    limit: await limitParamInit(ctx.params),
    offset: await offsetParamInit(ctx.params),
    bboxcrs: await crsParamInit(ctx.params),
    parameter_names: await parameter_namesParamInit(ctx.params),
    coords: await parsedCoordsParam(ctx.params),
    instanceId: await instanceIdParamInit(ctx.params),
    instanceMode: await instanceModeParamInit(ctx.params),
    collectionId: await collectionIdParamInit(ctx.params),
    locationId: await locationIdParamInit(ctx.params),
    itemId: await itemIdParamInit(ctx.params),
    height_units: await heightUnitsParamInit(ctx.params),
    corridor_height: await corridorHeightParamInit(ctx.params),
    width_units: await widthUnitsParamInit(ctx.params),
    corridor_width: await corridorWidthParamInit(ctx.params),
    resolutionX: await resolutionXParamInit(ctx.params),
    resolutionY: await resolutionYParamInit(ctx.params),
    resolutionZ: await resolutionZParamInit(ctx.params),
    within_units: await withinUnitsParamInit(ctx.params),
    within: await withinParamInit(ctx.params),
    //cubeZ: await cubeZParamInit(ctx),
    z: await parsedZparam(ctx.params),
    datetime: await parsedDatetimeParam(ctx.params),
    f: await fParamInit(ctx.params),
    contentcrsHeader: await contentcrsHeader(crs),
    //datetime: await datetimeParamInit(ctx),
    //f: await fParamInit(ctx),
  };
};
export default commonParams;

export const fParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => {
  console.log(ctxParams.query.parsedf)
  return ctxParams.query.parsedf as CNValueNew?? undefined};

/**
 * @param crs The output of the validation of the crs param
 */
export const contentcrsHeader = async (crs: CrsDetail) => `<${crs.crs}>`;
const coordsParamInit_unparsed = async (
  params: ParametersByLocation<ParametersMap<any>>
) => (params.query.coords as string) ?? undefined;

const parsedCoordsParam = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) =>
  (ctxParams.query.parsedcoords as {
    zmin: null | number;
    zmax: null | number;
    mmin: string | null;
    mmax: string | null;
    coords2d: string;
  }) ?? undefined;
export const validateCrsUri = async (uri: string) =>
  crsDetails._allCrsProperties.find((crsDet) => crsDet.crs === uri) ??
  crsDetails._allCrsProperties.find((crsDet) => crsDet.code === "CRS84");

const crsParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) =>
  (await validateCrsUri(ctxParams.query.crs)) ??
  (await validateCrsUri(crsDetails.crs84Uri));

const bboxCrsParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
): Promise<CrsDetail> =>
  (await validateCrsUri(ctxParams.query["bbox-crs"])) ??
  (await validateCrsUri(crsDetails.crs84Uri));

export const validateBboxParam = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => {
  //const unsortedBbboxArray = await bboxParamInit(ctx);
  const bboxParam = ctxParams.query.bbox;
  const bboxCrs = await bboxCrsParamInit(ctxParams);
  let xyAxisBbox: [number, number, number, number] | undefined;
  let zAxisBbox: [number, number] | undefined;
  if (ctxParams.query.bbox === undefined) {
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
const parameter_namesParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => {
  //console.log(ctxParams.query["parameter-name"]);
  return ctxParams.query["parameter-name"]
    ? (ctxParams.query["parameter-name"].split(",") as Array<string>)
    : undefined;
};

const reqUriGen = async (
  serverObject: { url: string; description?: string },
  req: HttpIncomingMessage,
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => {
  //Replace is used because of the current pathnames.
  //For instance, since the served is hosted on domain.com/{standardName} and the req.url=/{standardName}/
  // This results in the duplication of "/{standardName}"
  const url = new URL(
    serverObject.url + req.url //.replace("/edr", "")
  );

  if (req.url.startsWith("/edr") && serverObject.url.endsWith("/edr")) {
    url.pathname.replace("/edr", "");
  }
  //Band aid
  if (
    req.url.startsWith("/features") &&
    serverObject.url.endsWith("/features")
  ) {
    url.pathname.replace("/features", "");
  }
  //if(url.pathname.split("/").)
  //Remove search strings because it includes undocumented params and does not include oas param defaults
  url.search = "";

  //Add params listed on oas doc
  for (const [k, v] of Object.entries(ctxParams.query)) {
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
  ctxParams: ParametersByLocation<ParametersMap<any>>
): Promise<number> =>
  ctxParams.query.limit || ctxParams.query.limit === 0
    ? ctxParams.query.limit
    : 100;

export const offsetParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
): Promise<number> =>
  ctxParams.query.offset || ctxParams.query.offset === 0
    ? ctxParams.query.offset
    : 0;

/**
 * @function instanceModeParamInit not really necessary considering its required by exegesis and it has a default
 */
export const instanceModeParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
): Promise<string> => ctxParams.query.instancemode ?? "subregion";

const collectionIdParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => ctxParams.path.collectionId ?? undefined;

const instanceIdParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => ctxParams.path.instanceId ?? undefined;

const locationIdParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.path.locationId as string) ?? undefined;

const itemIdParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.path.itemId as string) ?? undefined;

/**
 * @param ctx.params.query["height-units"]
 */
const heightUnitsParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) =>
  //ctx.params.query["height-units"]
  (ctxParams.query["height-units"] as Length) ?? undefined;

/**
 * @param ctx.params.query["corridor-height"]
 */
export const corridorHeightParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.query["corridor-height"] as number) ?? undefined;

/**
 *
 * @param ctx.params.query["width-units"]
 * @returns Length | undefined
 */
export const widthUnitsParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.query["width-units"] as Length) ?? undefined;

/**
 *
 * @param ctx.params.query["corridor-width"]
 * @returns
 */
const corridorWidthParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.query["corridor-width"] as number) ?? undefined;

/**
 *
 * @param ctx.params.query["resolution-z"]
 * @returns
 */
const resolutionZParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => ctxParams.query["resolution-z"] ?? undefined;

/**
 *
 * @param ctx.params.query["resolution-x"]
 * @returns
 */
const resolutionXParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => ctxParams.query["resolution-x"] ?? undefined;

/**
 *
 * @param ctx.params.query["resolution-y"]
 * @returns
 */
const resolutionYParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => ctxParams.query["resolution-y"] ?? undefined;

/**
 *
 * @param ctx.params.query["within-units"]
 * @returns
 */
const withinUnitsParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.query["within-units"] as Length) ?? undefined;

/**
 *
 * @param params.within
 * @returns
 */
const withinParamInit = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.query.within as number) ?? undefined;

const zParamInit_unparsed = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => (ctxParams.query.z as string) ?? undefined;

/**
 *
 * @param ctx.params.query.parsedz
 * @returns
 */
const parsedZparam = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) =>
  (ctxParams.query.parsedz as {
    min: number | undefined;
    max: number | undefined;
    in: number[] | undefined;
    one: number | undefined;
    //incrementBy: number | undefined;
    //intervalNumber: number | undefined;
  }) ?? undefined;

//TO DO
const datetimeParamInit_unparsed = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) => ctxParams.query.datetime ?? undefined;

const parsedDatetimeParam = async (
  ctxParams: ParametersByLocation<ParametersMap<any>>
) =>
  (ctxParams.query.parseddatetime as {
    start: string | undefined;
    end: string | undefined;
    one: string | undefined;
  }) ?? undefined;
