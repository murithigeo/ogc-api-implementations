

import { ExegesisContext } from "exegesis-express";
import {
  crs84Uri,
  crs84hUri,
  crs_properties,
  supportedcrs_array,
} from "./crsconfig";
import { Crs_prop } from "../../types";

async function validate_crs_string(crsPram: string): Promise<Crs_prop[]> {
  const validCrs = crs_properties.filter((crsProp) => crsProp.uri === crsPram);
  return validCrs;
}

async function crs_param_init(context: ExegesisContext): Promise<string> {
  const crsparamstring: string = context.params.query.crs
    ? context.params.query.crs
    : supportedcrs_array.filter((crsuri) => crsuri === (crs84Uri || crs84hUri));
  return crsparamstring;
}

async function bboxcrs_param_init(context: ExegesisContext): Promise<string> {
  const bboxcrsstring: string = context.params.query["bbox-crs"]
    ? context.params.query["bbox-crs"]
    : supportedcrs_array.filter(
        (crsuri) =>
          crsuri ===
          ("http://www.opengis.net/def/crs/OGC/1.3/CRS84" ||
            "http://www.opengis.net/def/crs/OGC/1.3/CRS84h")
      );
  return bboxcrsstring;
}

/**
 * Validates the coordinate parameters in the given Exegesis context.
 * @param context - The Exegesis context.
 * @returns A promise that resolves to an object containing the validated coordinate parameters.
 */
async function coordParams_validate(context: ExegesisContext): Promise<{
  flipCoords: boolean;
  crs_vArray: Crs_prop[];
  bboxcrs_vArray: Crs_prop[];
}> {
  const bboxcrs_vArray = await validate_crs_string(
    await bboxcrs_param_init(context)
  );
  const crs_vArray = await validate_crs_string(await crs_param_init(context));

  const flipCoords: boolean =
    crs_vArray.length > 1 && crs_vArray[0].isGeographic === true;
  return { flipCoords, bboxcrs_vArray, crs_vArray };
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
  const { bboxcrs_vArray } = await coordParams_validate(context);
  let bboxArray: bbox_w_height | bbox_wo_height;
  if (context.params.query.bbox) {
    const bboxParam = context.params.query.bbox;
    if (bboxcrs_vArray.length > 0) {
      if (bboxcrs_vArray[0].uri === crs84hUri) {
        bboxArray = [
          bboxParam[0],
          bboxParam[1],
          bboxParam[2],
          bboxParam[3],
          bboxParam[4],
          bboxParam[5],
        ];
      } else {
        if (bboxcrs_vArray[0].isGeographic === false) {
          bboxArray = [bboxParam[0], bboxParam[1], bboxParam[2], bboxParam[3]];
        }
        if (bboxcrs_vArray[0].isGeographic === true) {
          bboxArray = [bboxParam[1], bboxParam[0], bboxParam[3], bboxParam[2]];
        }
      }
    }
  }
  return bboxArray;
}
async function contentcrsheader_header_init(
  crs_vArray: Crs_prop[]
): Promise<string> {
  const contentcrsheader =
    crs_vArray.length > 0 ? `<${crs_vArray[0].uri}` : `<${crs84Uri}`;
  return contentcrsheader;
}

async function limitoffset_param_init(context: ExegesisContext): Promise<{
  offset: number;
  limit: number;
  prevPageOffset: number;
  nextPageOffset: number;
}> {
  const limit: number = context.params.query.limit
    ? context.params.query.limit
    : 100;
  const offset: number =
    !context.params.query.offset || context.params.query.offset < 0
      ? 0
      : context.params.query.offset;
  const nextPageOffset = offset + limit;
  const prevPageOffset = offset - limit;
  return { offset, limit, prevPageOffset, nextPageOffset };
}

export default async function initCommonQueryParams(
  context: ExegesisContext
): Promise<{
  contentcrsHeader: string;
  limit: number;
  flipCoords: boolean;
  bboxArray: bbox_w_height | bbox_wo_height;
  crs_vArray: Crs_prop[];
  bboxcrs_vArray: Crs_prop[];
  nextPageOffset: number;
  prevPageOffset: number;
  offset: number;
}> {
  const { flipCoords, bboxcrs_vArray, crs_vArray } = await coordParams_validate(
    context
  );
  const contentcrsHeader = await contentcrsheader_header_init(crs_vArray);
  const bboxArray = await bbox_param_init(context);
  const { nextPageOffset, prevPageOffset, limit, offset } =
    await limitoffset_param_init(context);
  return {
    contentcrsHeader,
    flipCoords,
    bboxArray,
    crs_vArray,
    bboxcrs_vArray,
    nextPageOffset,
    limit,
    offset,
    prevPageOffset,
  };
};
