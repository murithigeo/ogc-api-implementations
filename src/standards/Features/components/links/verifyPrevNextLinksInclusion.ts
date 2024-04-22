import { ExegesisContext } from "exegesis-express";
import coreServerQueryParams from "../params";
import { DbResultCount } from "../../../../types";


export default async function verifyHas_NextPrevStatus(context: ExegesisContext, count: DbResultCount){
    let { hasNextPage, hasPrevPage, limit, offset } = await coreServerQueryParams(context);
    /**
     * 
     */
    if (count < 1) {
        hasNextPage = false;
        hasPrevPage = false;
    } else if (count === offset) {
        //This scenario is if @param count is equal to offset
        //In this scenario, offset effectively skips over all the features that have matched the query
        hasPrevPage = true;
        hasNextPage = false;
    };
    return { hasNextPage, hasPrevPage };
}