import { Length } from "convert";
import * as crsDetails from "../../components/crsdetails";
import makeQueryValidationError from "../../components/makeValidationError";
import * as index from "../index";
/**
 * @path .../trajectory
 * @throws Error if @param coords is @type LINESTRINGZ as well as @param z
 * @throws Error if @param coords is @type LineStringM as well as @param datetime is defined
 * @throws Error if @param coords is @type LineStringZM as well as @param datetime & @param datetime is defined
 * @status 400
 */

import { ExegesisContext } from "exegesis-express";

/**
 * @path ../corridor
 * @throws Error if @param coords is @type LINESTRINGZ as well as @param z
 * @throws Error if @param coords is @type LineStringM as well as @param datetime is defined
 * @throws Error if @param coords is @type LineStringZM as well as @param datetime & @param datetime is defined
 */

/**
 * @function edrCommonParams A function used to get common variables from the exegesis interfaces
 */

const edrCommonParams = async (ctx: ExegesisContext) => {
  const bboxVals = await validateBboxParam(ctx);
  return {
    xyAxisBbox: ctx.params.query.bbox ? bboxVals.xyAxisBbox : undefined,
    zAxisBbox:
      ctx.params.query.bbox && ctx.params.query.bbox.length > 4
        ? bboxVals.zAxisBbox
        : undefined,
    crs: await validateCrsParam(ctx),
    _url: await reqUriGen(ctx),
    limit: await limitParamInit(ctx),
    offset: await offsetParamInit(ctx),
    bboxcrs: await validateBboxCrs(ctx),
    parameter_names: await parameter_namesParamInit(ctx),
    coords: await coordsParamInit(ctx),
    instanceId: await instanceIdParamInit(ctx),
    instanceMode: await instanceModeParamInit(ctx),
    collectionId: await collectionIdParamInit(ctx),
    locationId: await locationIdParamInit(ctx),
    itemId: await itemIdParamInit(ctx),
    height_units: await heightUnitsParamInit(ctx),
    corridor_height: await corridorHeightParamInit(ctx),
    width_units: await widthUnitsParamInit(ctx),
    corridor_width: await corridorWidthParamInit(ctx),
    resolutionX: await resolutionXParamInit(ctx),
    resolutionY: await resolutionYParamInit(ctx),
    resolutionZ: await resolutionZParamInit(ctx),
    within_units: await withinUnitsParamInit(ctx),
    within: await withinParamInit(ctx),
    cubeZ: await cubeZParamInit(ctx),
    z: await zParamInit(ctx),
    datetime: await datetimeParamInit(ctx),

    //datetime: await datetimeParamInit(ctx),
    //f: await fParamInit(ctx),
  };
};
export default edrCommonParams;

const coordsParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.coords ?? undefined;

export const validateCrsUri = async (uri: string) =>
  crsDetails._allCrsProperties.find((crsDet) => crsDet.crs === uri);

const crsParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.crs
    ? ctx.params.query.crs
    : crsDetails.crs84Uri || crsDetails.crs84hUri;

const bboxCrsParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["bbox-crs"]
    ? ctx.params.query["bbox-crs"]
    : crsDetails.crs84Uri || crsDetails.crs84hUri;

const validateCrsParam = async (ctx: ExegesisContext) =>
  await validateCrsUri(await crsParamInit(ctx));

const validateBboxCrs = async (ctx: ExegesisContext) =>
  await validateCrsUri(await bboxCrsParamInit(ctx));

const bboxParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.bbox ? (ctx.params.query.bbox as Array<number>) : undefined;

const validateBboxParam = async (ctx: ExegesisContext) => {
  const unsortedBbboxArray = await bboxParamInit(ctx);
  const bboxCrs = await validateBboxCrs(ctx);
  let xyAxisBbox: [number, number, number, number] | undefined;
  let zAxisBbox: [number, number] | undefined;
  if (unsortedBbboxArray === undefined) {
    xyAxisBbox = undefined;
    return;
  } else {
    if (bboxCrs.isGeographic === true) {
      if (unsortedBbboxArray.length > 4) {
        xyAxisBbox = [
          unsortedBbboxArray[1],
          unsortedBbboxArray[0],
          unsortedBbboxArray[4],
          unsortedBbboxArray[3],
          //maxz
        ];
        zAxisBbox = [unsortedBbboxArray[2], unsortedBbboxArray[5]]; //minz
      } else {
        xyAxisBbox = [
          unsortedBbboxArray[1],
          unsortedBbboxArray[0],
          unsortedBbboxArray[3],
          unsortedBbboxArray[2],
        ];
        zAxisBbox = undefined;
      }
    } else {
      if (unsortedBbboxArray.length > 4) {
        xyAxisBbox = [
          unsortedBbboxArray[0],
          unsortedBbboxArray[1],
          unsortedBbboxArray[3],
          unsortedBbboxArray[4],
          //maxz
        ];
        zAxisBbox = [unsortedBbboxArray[2], unsortedBbboxArray[5]]; //minz
      } else {
        xyAxisBbox = [
          unsortedBbboxArray[0],
          unsortedBbboxArray[1],
          unsortedBbboxArray[2],
          unsortedBbboxArray[3],
        ];
      }
    }
  }
  return { xyAxisBbox, zAxisBbox } || undefined;
};

//const functionToUseForItemsInBoundingBox=async(ctx:ExegesisContext)=>{}
const parameter_namesParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["parameter-name"] !== undefined
    ? (ctx.params.query["parameter-name"].split(",") as Array<string>)
    : undefined;

const reqUriGen = async (ctx: ExegesisContext) => {
  //Replace is used because of the current pathnames.
  //For instance, since the served is hosted on domain.com/{standardName} and the req.url=/{standardName}/
  // This results in the duplication of "/{standardName}"
  const url = new URL(
    ctx.api.serverObject.url + ctx.req.url.replace("/edr", "")
  );

  //Remove search strings because it includes undocumented params and does not include oas param defaults
  url.search = "";

  //Add params listed on oas doc
  for (const [k, v] of Object.entries(ctx.params.query)) {
    if (v) {
      url.searchParams.set(k, v);
    }
  }
  return url;
};

const limitParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.limit || ctx.params.query.limit === 0
    ? ctx.params.query.limit
    : 100;

const offsetParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.limit || ctx.params.query.offset === 0
    ? ctx.params.query.offset
    : 0;

/**
 * @function instanceModeParamInit not really necessary considering its required by exegesis and it has a default
 */
const instanceModeParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.instancemode ?? "subregion";

const collectionIdParamInit = async (ctx: ExegesisContext) =>
  ctx.params.path.collectionId as string;

const instanceIdParamInit = async (ctx: ExegesisContext) =>
  ctx.params.path.instanceId as string;

const locationIdParamInit = async (ctx: ExegesisContext) =>
  ctx.params.path.locationId as string;

const itemIdParamInit = async (ctx: ExegesisContext) =>
  ctx.params.path.itemId as string;

const heightUnitsParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["height-units"]
    ? (ctx.params.query["height-units"] as Length)
    : undefined;

const corridorHeightParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["corridor-height"]
    ? (ctx.params.query["corridor-height"] as number)
    : undefined;

const widthUnitsParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["width-units"]
    ? (ctx.params.query["width-units"] as Length)
    : undefined;

const corridorWidthParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["corridor-width"]
    ? (ctx.params.query["corridor-width"] as number)
    : undefined;

const resolutionZParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["resolution-z"]
    ? (ctx.params.query["resolution-z"] as number)
    : undefined;

const resolutionXParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["resolution-x"]
    ? (ctx.params.query["resolution-x"] as number)
    : undefined;

const resolutionYParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["resolution-y"]
    ? (ctx.params.query["resolution-y"] as number)
    : undefined;

const withinUnitsParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["within-units"]
    ? (ctx.params.query["within-units"] as Length)
    : undefined;

const withinParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query.within ? (ctx.params.query.within as number) : undefined;

const cubeZParamInit = async (ctx: ExegesisContext) =>
  ctx.params.query["cube-z"]
    ? (ctx.params.query["cube-z"] as string)
    : undefined;

const zParamInit = async (ctx: ExegesisContext) => {
  const z = ctx.params.query.z as string;

  if (z) {
    let separator: "/" | "," | "none";
    if (z.includes("/")) {
      separator = "/";
    } else if (z.includes(",")) {
      separator = ",";
    }
    separator = "none";
    return {
      zValues: z.split("/" || ","),
      separator,
    };
  }
  return undefined;
};

//TO DO
const datetimeParamInit = async (ctx: ExegesisContext) => {
  return ctx.params.query.datetime
    ? (ctx.params.query.datetime as {
        start: string | undefined;
        end: string | undefined;
        one: string | undefined;
      })
    : undefined;
};

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
