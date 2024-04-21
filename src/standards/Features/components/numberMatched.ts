import { ExegesisContext } from "exegesis-express";
import coreServerQueryParams from "./params";

export async function generateNumberMatched(count: number, context: ExegesisContext) {
    const { limit, offset } = await coreServerQueryParams(context);
    let numberMatched: number = 0;

    const startIndex = Math.min(offset, count);
    const endIndex = Math.min(startIndex + limit, count);
    numberMatched += endIndex - startIndex;
    return {numberMatched}

    /**
     * 
     */
}