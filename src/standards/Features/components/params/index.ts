import { ExegesisContext } from "exegesis-express";
import { initializeBoundingBox, validateIncomingCrs_BboxCrs } from "./crs";
import { initializeLimitOffset } from "./offset_limit";
import validateQueryParams from "../../../../components/validateQueryParameters";

export default async function coreApiParams(context: ExegesisContext) {
    const { flipCoords, validated_bboxcrs, validated_crs } = await validateIncomingCrs_BboxCrs(context);
    const { limit, offset } = await initializeLimitOffset(context);
    const bbox = await initializeBoundingBox(context);
    const unexpectedParams = await validateQueryParams(context);
    return {
        unexpectedParams,
        flipCoords,
        validated_bboxcrs,
        validated_crs,
        limit,
        offset,
        bbox
    }
}