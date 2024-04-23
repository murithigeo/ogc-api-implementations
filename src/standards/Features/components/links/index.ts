import { ExegesisContext } from "exegesis-express";
import { CollectionId, Link, FeatureId } from "../../../../types";
import { ContentNegotiationObject, initializeF } from "../params/f";
import { URL } from 'url';
import coreServerQueryParams from "../params";
import createSelfAltLinks from "../links/createSelfAltLinks";
import filter_generateQueryParamString from "../links/createQueryString";
import { createLinksToCollectionFromFeature, createLinksToCollectionFromItems, createLinksToItemsFromCollection, createLinksToItemsFromFeature } from "../links/createLinksToNestedResource";
import createUrlToCurrentEndpoint from "../links/createUrlToCurrentEndpoint";
import createPrevNextLinks from "../links/createPrevNextLinks";



export default async function createLinksForObjects(
    mode: 'Collection' | 'Landing' | 'FeatureCollection' | 'Feature' | 'Conformance' | 'none',
    context: ExegesisContext,
    contentTypes_f: ContentNegotiationObject[],
    queryParamsToIgnore?: string[],
    //itemsContentTypes?: ContentNegotiationObject[],
    count?: number
) {
    /**
     * @param excludedQueryParams is an array of SSR computed keys such as @offset | @limit | @f
     * Since apiKey queryParam will be used as authentication later, push, apiKey to the @param excludedQueryParams
     */
    const excludedQueryParams: string[] = [];
    if (queryParamsToIgnore) {
        excludedQueryParams.push(...queryParamsToIgnore); //Load user provided query params to the excludedQueryParams array
    };
    const { selfOptions, alternateOptions } = await initializeF(context, contentTypes_f);

    //Initialize the queryParamString
    const queryString = await filter_generateQueryParamString(context, queryParamsToIgnore);

    //Generate rel=self|alternate links & initialize the link array
    const links = await createSelfAltLinks(context, selfOptions, alternateOptions, queryString)
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
    const resourceUrl = await createUrlToCurrentEndpoint(context);
    /**
     * Generate a @interface Link Object where rel=self
     */
    switch (mode) {
        case 'Collection':
            const otherLinks = await createLinksToItemsFromCollection(context, selfOptions, alternateOptions,);
            links.push(...otherLinks);
            break;
        case 'Feature':
            let linksForFeature = await createLinksToItemsFromFeature(context, selfOptions, alternateOptions);
            links.push(...linksForFeature);
            break;
        case 'FeatureCollection':
            if (!count) {
                throw new Error(`Links generation for a Feature Collection depends on number of Features matching Query(count)`);
            };

            //push the links possibly generated to the main links array
            let linksForFeatureCollection = await createLinksToCollectionFromItems(context, selfOptions, alternateOptions);
            let prevNextLinks = await createPrevNextLinks(context, count, selfOptions, queryString)
            //if(prevNextLinks.length>0){
                links.push(...prevNextLinks)
            //}
            links.push(...linksForFeatureCollection);
            break;
        case 'Landing':
            /**
             * @interface Link generate two links for @rel data (html/json)
             */
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