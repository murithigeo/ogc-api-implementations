import { ExegesisContext } from "exegesis-express";
import { CollectionId, Link, FeatureId } from "../../../types";
import { ContentNegotiationObject, initializeF } from "./params/f";
import { URL } from 'url';
import coreServerQueryParams from "./params";



export async function generateLinks(
    mode: 'Collection' | 'Landing' | 'FeatureCollection' | 'Feature' | 'Conformance' | 'none',
    context: ExegesisContext,
    contentTypes_f: ContentNegotiationObject[],
    queryParamsToIgnore?: string[],
    itemsContentTypes?: ContentNegotiationObject[],
    count?: number

) {
    /**
     * @param excludedQueryParams is an array of SSR computed keys such as @offset | @limit | @f
     * Since apiKey queryParam will be used as authentication later, push, apiKey to the @param excludedQueryParams
     */
    const excludedQueryParams: string[] = ['apiKey'];
    if (queryParamsToIgnore) {
        excludedQueryParams.push(...queryParamsToIgnore); //Load user provided query params to the excludedQueryParams array
    }
    /**
     * @param linkArray[0].rel==='self'
     */

    /**
     * @resourceUrl Is the full path to endpoint.
     * @example http://localhost/conformance
     * Is formed through @context.api.serverObject.url + @context.req.url
     * @context.api.serverObject is an OpenAPI ServerObject matched by Exegesis. Refer to @external https://github.com/exegesis-js/exegesis/blob/master/docs/Exegesis%20Controllers.md
     * @context.req.url is the relative link to the resource requested. Does not include params
     */
    const resourceUrl = await generateResourceUrl(context);


    const queryString = await filterQueryParams(context, excludedQueryParams);

    const { selfOptions, alternateOptions } = await initializeF(context, contentTypes_f);

    /**
     * @param links initialize the links array with 'self' & alternate objects
     */
    const links = await generateSelfAlternateLinks(context, selfOptions, alternateOptions, queryString);
    /**
     * Generate a @interface Link Object where rel=self
     */
    switch (mode) {
        case 'Collection':
            if (!itemsContentTypes) {
                throw new Error('Must provide content types for all possible f values for items endpoint')
            };
            for (const link of itemsContentTypes) {
                links.push({
                    rel: 'items',
                    title: `View Items included in this collection as ${selfOptions[0].f}`,
                    href: `${resourceUrl}/items?f=${selfOptions[0].f}`,
                    type: `${link.type}`
                });
            };
            break;
        case 'Feature':
            var baseURL = new URL(resourceUrl);
            //const collectionUrl = 
            //const url = new URL('http://localhost/features/collections/x/items/f');

            // Remove the last path segment
            resourceUrl.pathname = (baseURL.pathname.slice(0, -baseURL.pathname.split('/').pop().length))
            baseURL.toString();

            //console.log(url.toString()); // Output: http://localhost/features/collections/x/items

            /**
             * Generate a link to the items endpoint with the same contenttype
             */
            for (const link of selfOptions) {
                links.push({
                    //href: `${resourceUrl}/`
                    type: `${link.type}`,
                    href: `${baseURL}/items?f=${link.f}`,
                    title: `View the main items`,
                    rel: `items`
                });
            };
            break;
        case 'FeatureCollection':
            if (!count) {
                throw new Error(`Links generation for a Feature Collection depends on number of Features matching Query(count)`);
            };
            const nextPrevLinks = await generatePrevNextLinks(context, count, selfOptions, queryString);
            //push the links possibly generated to the main links array
            links.push(...nextPrevLinks);
            break;
        case 'Landing':
            /**
             * @interface Link generate two links for @rel data (html/json)
             */
            for (const linkParams of alternateOptions && selfOptions) {
                links.push
            }
            links.push(
                {
                    rel: 'conformance',
                    href: `${resourceUrl}/conformance?f=${selfOptions[0].f + queryString}`,
                    type: `${selfOptions[0].type}`,
                    title: `View conformance document as ${selfOptions[0].f}`
                },
                {
                    rel: `service-desc`,
                    type: `application/vnd.oai.openapi+json;version=3.0`,
                    href: `${resourceUrl}/api`,
                    title: `View the OpenApi Document as an interactive console`
                },

                {
                    rel: `data`,
                    type: `${selfOptions[0].type}`,
                    title: `View collections hosted on this endpoint`,
                    href: `${resourceUrl}/collections?f=${selfOptions[0].f + queryString}`
                },
                {
                    rel: `service-doc`,
                    type: `text/html`,
                    title: `View the OpenApi Document as json`,
                    href: `${resourceUrl}/api`
                }
            );
            break;
    }


    //Add specific links to resources
    return links;
}