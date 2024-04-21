import { ExegesisContext } from "exegesis-express";

export async function initializeLimitOffset(context: ExegesisContext) {
    //No setting default value. Must be set in OpenAPI Document
    const limit: number = context.params.query.limit;

    /**
     * If offset is not set, set to zero (no pagination) or if less than 0, set to 0 (no pagination)
     * Otherwise, let user pass whatever they want
     */
    const offset: number = context.params.query.offset === undefined || context.params.query.offset < 0 ? 0 : context.params.query.offset;

    /**
     * @param nextPageOffset The value of offset that effectively returns new features different from those returned. This is like turning a new page
     * @param prevPageOffset The value of offset that returns features upto where current features are.
     */
    const nextPageOffset = offset + limit;
    const prevPageOffset = offset - limit;
    //const { limit, offset } = await coreServerQueryParams(context);

    /**
     * @status unstable
     * @param hasPrevPage @type boolean If offset is less than 0, then no features have been skipped, meaning no previous link is present;
     * @param hasNextPage @type boolean If offse
     */
    const hasPrevPage: boolean = offset < 1 || offset - limit === 0 ? false : true;
    const hasNextPage: boolean = offset - limit < 1 || offset - limit === 1 ? false : true;

    return { offset, limit, prevPageOffset, nextPageOffset, hasNextPage, hasPrevPage };
};
