import { ExegesisContext } from "exegesis-express";
import { CollectionId, Link, FeatureId } from "../../../types";
import { ContentNegotiationObject, initializeF } from "./params/f";

async function filterQueryParams(context: ExegesisContext, excludedQueryParams: string[]) {
    let queryParamString: string = ''; //Initialize the part of URL containing parameters
    for (const [key, value] of Object.entries(context.params.query)) {
        if (value !== undefined && !excludedQueryParams.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | boolean | number)}`;
        }
    }
    return queryParamString;
}

export async function generateLinks(
    mode: 'specificCollection' | 'Landing' | 'FeatureCollection' | 'Feature' | 'Conformance' | 'Collections',
    context: ExegesisContext,
    collectionId?: CollectionId,
    featureId?: FeatureId,
) {
    /**
     * @param excludedQueryParams is an array of SSR computed keys such as @offset | @limit | @f
     */

    /**
     * @param serverUrl should be the url requesting the site
     */
    let excludedQueryParams: string[] = [];
    /**
     * @param linkArray[0].rel==='self'
     */
    let linkArray: Link[] = []
    switch (mode) {
        case 'specificCollection':
            const queryString = await filterQueryParams(context, []);
            if (!collectionId) {
                throw new Error(`collectionId must be specified`);
            }
            const allowedContentTypes: ContentNegotiationObject[] = [
                {
                    f: `json`,
                    type: `application/json`
                },
                {
                    f: `html`,
                    type: `text/html`
                }
            ];
            const { self_f_types, alternate_f_types } = await initializeF(context, allowedContentTypes);
            linkArray.push({
                rel: `self`,
                title: `Document as ${self_f_types[0].f}`,
                href: `${context.baseUrl + context.route.path + queryString}`,
                type: `${self_f_types[0].type}`
            });
            for (const object of alternate_f_types) {
                linkArray.push({
                    rel: 'alternate',
                    title: `This document as ${object.f} `,
                    href: `${context.baseUrl + context.route.path + queryString}`,
                    type: `${object.type}`
                });
            }
            break;

    }
    return linkArray;
}