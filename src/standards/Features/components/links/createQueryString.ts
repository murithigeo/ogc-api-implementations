import { ExegesisContext } from "exegesis-express";

export default async function filter_generateQueryParamString(context: ExegesisContext, queryParamKeysToIgnore: string[]): Promise<string> {
    let queryParamString: string = '';
    for (const [key, value] of Object.entries(context.params.query)) {
        if (value !== undefined && !queryParamKeysToIgnore.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | boolean | number)}`;
        };
    };
    return queryParamString;
}