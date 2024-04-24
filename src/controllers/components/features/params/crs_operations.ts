import { ExegesisContext } from "exegesis-express";
import { httpMessages } from "../../../../httpMessages";
import { Crs_prop } from "../../../../types";
import { supportedcrs_properties } from "../config";


async function validateCRS(crs: string) {
    const validCrs = supportedcrs_properties.filter(crsObject => crsObject.uri === crs)
    // if requested CRS is not valid then validCRS.length<1||===0;
    return validCrs;
}

async function initializeCRS(context: ExegesisContext) {
    /**
     * @crs is not set as query param, then set uri of first @supportedcrs_properties object as crs
     */
    const crs: string = context.params.query.crs === undefined ? supportedcrs_properties[0].uri : context.params.query.crs;
    return crs;
};

async function initializeBboxCrs(context: ExegesisContext) {
    const bboxCrs: string = context.params.query['bbox-crs'] === undefined ? supportedcrs_properties[0].uri : context.params.query['bbox-crs'];
    return bboxCrs;
}


export async function validateIncomingCrs_BboxCrs(context: ExegesisContext) {
    /**
     * @validate_crs is an array containing validated coord. ref. sys. params
     */
    const validated_crs = await validateCRS(await initializeCRS(context));

    const validated_bboxcrs = await validateCRS(await initializeBboxCrs(context))

    /**
     * @flipCoords
     * set to @true when request has a valid crs (thus length>1) and isGeographic === true
     */
    const flipCoords: boolean = validated_crs.length > 1 && validated_crs[0].isGeographic === true;
    return { flipCoords, validated_bboxcrs, validated_crs }
}

type BoundingBox = [number, number, number, number];

export async function initializeBoundingBox(context: ExegesisContext): Promise<BoundingBox> {
    const { validated_bboxcrs } = await validateIncomingCrs_BboxCrs(context);

    const boundingboxArray: BoundingBox = validated_bboxcrs.length < 1 ? [undefined, undefined, undefined, undefined] :
        validated_bboxcrs[0].isGeographic === true ?
            [
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[1], //minx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[0], //miny
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[3], //maxx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[2] //maxy
            ] :
            [
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[0], //minx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[1], //miny
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[2], //maxx
                context.params.query.bbox === undefined ? undefined : context.params.query.bbox[3] //maxy
            ];
    return boundingboxArray;
}
/***
 * @param validated_crs An  array containing validated `crs` query parameter
 * Since this param is only used when serving the response (and after triggering HTTP400),
 *  no neeed to validate the param.
 * If validatedcrs array.length ===0, header defaults to <CRS84>
 */
export async function initializeContentCrsHeader(validated_crs: Crs_prop[]): Promise<string> {
    const header = validated_crs.length > 0 ? `<${validated_crs[0].uri}>` : `<${supportedcrs_properties[0]}>`;
    return header;
}