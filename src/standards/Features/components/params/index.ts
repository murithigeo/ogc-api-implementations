import { ExegesisContext } from "exegesis-express";
import { initializeBoundingBox, initializeContentCrsHeader, validateIncomingCrs_BboxCrs } from "./crs_operations";
import { initializeLimitOffset } from "./offset_limitOperations";
import validateQueryParams from "../../../../components/validateQueryParameters";

export default async function coreServerQueryParams(context: ExegesisContext) {
    const { flipCoords, validated_bboxcrs, validated_crs } = await validateIncomingCrs_BboxCrs(context);
    const { limit, offset } = await initializeLimitOffset(context);
    const bbox = await initializeBoundingBox(context);
    const unexpectedParams = await validateQueryParams(context);
    const contentcrsHeader = await initializeContentCrsHeader(validated_crs);
    return {
        contentcrsHeader,
        unexpectedParams,
        flipCoords,
        validated_bboxcrs,
        validated_crs,
        limit,
        offset,
        bbox
    };
}