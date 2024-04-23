import { ExegesisContext } from "exegesis-express";

/**
 * 
 * @param context An object provided by Exegesis
 * Each standard document's paths must have the general template starting with /standard/
 * @returns URL A string to the current requested endpoint
 * 
 */
export default async function createUrlToCurrentEndpoint(context: ExegesisContext): Promise<URL> {
    let url = new URL(context.api.serverObject.url + context.req.url);
    url.search = '';
    return url;
};