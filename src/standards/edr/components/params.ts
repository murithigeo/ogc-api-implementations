import * as crsDetails from "../../components/crsdetails";
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
  return {
    bbox: await validateBboxParam(ctx),
    crs: await validateCrsParam(ctx),
    _url: await reqUriGen(ctx),
    limit: await limitParamInit(ctx),
    offset: await offsetParamInit(ctx),
    bboxcrs: await validateBboxCrs(ctx),
    parameter_names: await parameter_namesParamInit(ctx)
  };
};
export default edrCommonParams;

const validateCrsUri = async (uri: string) =>
  crsDetails._allCrsProperties.find((crsDet) => crsDet.uri === uri);

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
  let sortedBboxArray:
    | [number, number, number, number, number?, number?]
    | undefined;
  if (unsortedBbboxArray === undefined) {
    sortedBboxArray = undefined;
    return;
  } else {
    if (bboxCrs.isGeographic === true) {
      if (unsortedBbboxArray.length > 4) {
        sortedBboxArray = [
          unsortedBbboxArray[1],
          unsortedBbboxArray[0],
          unsortedBbboxArray[2], //minz
          unsortedBbboxArray[4],
          unsortedBbboxArray[3],
          unsortedBbboxArray[5], //maxz
        ];
      }
      sortedBboxArray = [
        unsortedBbboxArray[1],
        unsortedBbboxArray[0],
        unsortedBbboxArray[3],
        unsortedBbboxArray[2],
      ];
    } else {
      if (unsortedBbboxArray.length > 4) {
        sortedBboxArray = [
          unsortedBbboxArray[0],
          unsortedBbboxArray[1],
          unsortedBbboxArray[2], //minz
          unsortedBbboxArray[3],
          unsortedBbboxArray[4],
          unsortedBbboxArray[5], //maxz
        ];
      }
      sortedBboxArray = sortedBboxArray = [
        unsortedBbboxArray[0],
        unsortedBbboxArray[1],
        unsortedBbboxArray[2],
        unsortedBbboxArray[3],
      ];
    }
  }
  return sortedBboxArray;
};

const parameter_namesParamInit= async (ctx: ExegesisContext) =>
  ctx.params.query.parameter_name !== undefined
    ? ctx.params.query.parameter_name.split(",") as Array<string>
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
