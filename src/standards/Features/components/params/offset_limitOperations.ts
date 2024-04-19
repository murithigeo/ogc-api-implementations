import { ExegesisContext } from "exegesis-express";

export async function initializeLimitOffset(context: ExegesisContext) {
    //No setting default value. Must be set in OpenAPI Document
    const limit: number = context.params.query.limit;

    /**
     * If offset is not set, set to zero (no pagination) or if less than 0, set to 0 (no pagination)
     * Otherwise, let user pass whatever they want
     */
    const offset: number = context.params.query.offset === undefined || context.params.query.offset < 0 ? 0 : context.params.query.offset;
    return { offset, limit };
}
