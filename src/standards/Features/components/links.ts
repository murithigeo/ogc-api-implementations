import { ExegesisContext } from "exegesis-express";
import { CollectionId, Link, FeatureId } from "../../../types";
import { ContentNegotiationObject, initializeF } from "./params/f";
import url from 'url';
import coreServerQueryParams from "./params";
async function filterQueryParams(context: ExegesisContext, excludedQueryParams: string[]) {
    let queryParamString: string = ''; //Initialize the part of URL containing parameters
    for (const [key, value] of Object.entries(context.params.query)) {
        if (value !== undefined && !excludedQueryParams.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | boolean | number)}`;
        };
    };
    return queryParamString;
};
async function generateResourceUrl(context: ExegesisContext) {
    const url: string = context.api.serverObject.url + context.req.url + '/features'; //Because '
    return url;
};
async function hasPageScenarios(count: number, offset: number, limit: number, hasNextPage: boolean, hasPrevPage: boolean) {
    /**
     * @param count because in a similar scenario where FeatureCollection.features.length<1(0), then there are no next or prev pages
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
async function generateSelfAlternateLinks(context: ExegesisContext, selfOptions: ContentNegotiationObject[], alternateOptions: ContentNegotiationObject[], queryString: string,) {
    const resourceUrl = generateResourceUrl(context);
    let links: Link[] = [];
    for (const object of selfOptions) {
        links.push({
            rel: `self`,
            title: `Document as ${object.f}`,
            href: `${resourceUrl + queryString}`,
            type: `${object.type}`
        });
    };

    /**
     * Generate @interface Link objects where f=alternate
     */
    for (const object of alternateOptions) {
        links.push({
            rel: 'alternate',
            title: `This document as ${object.f} `,
            href: `${resourceUrl + queryString}`,
            type: `${object.type}`
        });
    };
    return links;
};


async function generatePrevNextLinks(context: ExegesisContext, count: number, selfOptions: ContentNegotiationObject[], queryString: string) {
    let links: Link[] = [];
    const resourceUrl = generateResourceUrl(context);
    let { prevPageOffset, nextPageOffset, hasNextPage, hasPrevPage, offset, limit } = await coreServerQueryParams(context);

    hasNextPage = (await hasPageScenarios(count, offset, limit, hasNextPage, hasNextPage)).hasNextPage;
    hasPrevPage = (await hasPageScenarios(count, offset, limit, hasNextPage, hasPrevPage)).hasPrevPage;
    if (hasPrevPage === true) {
        for (const linkParams of selfOptions) {
            links.push({
                rel: `prev`,
                title: `Next Page of results`,
                href: `${resourceUrl}?f=${linkParams.f}&offset=${prevPageOffset + queryString}`,
                type: `${linkParams.type}`
            });
        };
    };

    if (hasNextPage === true) {
        for (const linkParams of selfOptions) {
            links.push({
                rel: `next`,
                title: `next Page of results`,
                href: `${resourceUrl}?f=${linkParams.f}&offset=${nextPageOffset + queryString}`,
                type: `${linkParams.type}`
            });
        };
    };
    return links;
}


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
            baseURL.pathname = (baseURL.pathname.slice(0, -baseURL.pathname.split('/').pop().length))
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