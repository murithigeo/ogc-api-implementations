//import('query-string');

export default async function validateQueryParams(context: any) {
    /**
     * //newer alternative to querystring but uses ECMA imports?
     */
    const queryString= (await import('query-string')).default; 
    //This function is used because exegesis seems to not trigger error when an undocumented queryparameter is included in request
    /**
     * @allowedParams is an array containing valid query parameters.
     */
    const allowedParams: string[] = ["apikey"];


    // Push exegesis-initialized queryparameters into allowedParams array
    //Only for endpoints with parameters
    if (Object.keys(context.params.query).length > 0) {
        allowedParams.push(...Object.keys(context.params.query))
    }

    //This is the reason that context has an [any] type. _parsedUrl is not a type of ExegesisContext
    //[All documented (allowed)/undocumented(illegal)] query params do exist at this endpoint
    
    const receivedParams = queryString.parse(context.req._parsedUrl.query);
    //console.log(receivedParams)
    const unexpectedParams = Object.keys(receivedParams).filter(param => !allowedParams.includes(param));
    return unexpectedParams;
}