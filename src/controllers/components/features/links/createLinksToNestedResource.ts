import { ExegesisContext, } from "exegesis-express";
import createUrlToCurrentEndpoint from "./createUrlToCurrentEndpoint";
import { Link } from "../../../../types";
import { ContentNegotiationObject } from "../params/f";
import changeLinkTypeForNestedLinks from "./changeLink_TypeForNestedLinks";
import filter_generateQueryParamString, { addApiKeyToQueryParamString } from "./createQueryString";

/**
 * Note that the @interface Link[] objects returned by these functions may fail to include a @type k,v so as to reduce the complexity of processing.
 * However, 
 */
/**
 * @function createLinksToCollectionFromItems generates an object to the /collections/{collectionId} as required
 */

export async function createLinksToCollectionFromItems(context: ExegesisContext, selfOptions: ContentNegotiationObject[], altOptions: ContentNegotiationObject[]) {
    const linkToCurrEndpoint = await createUrlToCurrentEndpoint(context);
    //Strip the url to get to the appropriate path. Slice last  element ({items}})
    linkToCurrEndpoint.pathname = linkToCurrEndpoint.pathname.slice(0, -linkToCurrEndpoint.pathname.split('/').pop().length)
    const links: Link[] = [];
    //const queryParamString= await filter_generateQueryParamString(context,['bbox-crs','limit','of])
    for (let option of selfOptions) {
        option = await changeLinkTypeForNestedLinks(option, 'json', 'application/json');
        links.push({
            type: option.type,
            rel: 'collection',
            href: `${linkToCurrEndpoint}?f=${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the collecton document as ${option.f}`,
            //type: `${options.f === 'json' ? 'application/json' : options.f === 'html'? 'text/html':;}`
        });
    };
    for (let option of altOptions) {
        option = await changeLinkTypeForNestedLinks(option, 'json', 'application/json');
        links.push({
            type: option.type,
            rel: 'collection',
            href: `${linkToCurrEndpoint}?f=${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the collection document as ${option.f}`
        });
    };
    return links;
};

/**
 * @description This function is only to be called when generating the link[] for requests to /collections/{collectionId}/items/{featureId}
 * @function createLinksToCollectionFromFeature generates an object to /collections/{collectionId}
 * @param selfOptions To enable an user to navigate to the path while maintaining the same content type. I.e. text/html
 * @param altOptions Provide the user with the option to get the endpoint using an alternate content-type
 * Maybe we can hold on defining the @interface Link.type so as to simplify the process. Instead just define the f={selfOptions.f}
 * @returns Link[]
 */
export async function createLinksToItemsFromFeature(context: ExegesisContext, selfOptions: ContentNegotiationObject[], altOptions: ContentNegotiationObject[]) {
    const linkToCurrEndpoint = await createUrlToCurrentEndpoint(context);
    //Strip the url to get to the appropriate path. Slice last  element ({items}})
    linkToCurrEndpoint.pathname = linkToCurrEndpoint.pathname.slice(0, -linkToCurrEndpoint.pathname.split('/').pop().length)
    const links: Link[] = [];
    for (let option of selfOptions) {
        //option = await changeLinkTypeForNestedLinks(option,'json','')
        links.push({
            type: option.type,
            rel: 'collection',
            href: `${linkToCurrEndpoint}?f=${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the collecton document as ${option.f}`,
        });
    };
    for (let option of altOptions) {
        //option = await changeLinkTypeForNestedLinks(option, 'json', 'application/json');
        links.push({
            type: option.type,
            rel: 'collection',
            href: `${linkToCurrEndpoint}?f${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the collection document as ${option.f}`
        });
    };
    //http://
    return links;
};

export async function createLinksToCollectionFromFeature(context: ExegesisContext, selfOptions: ContentNegotiationObject[], altOptions: ContentNegotiationObject[]) {
    const linkToCurrEndpoint = await createUrlToCurrentEndpoint(context);
    /**
     * @param linkToCurrEndpoint.pathname convert to array and remove the last two elements (items/featureId)
     */
    linkToCurrEndpoint.pathname = linkToCurrEndpoint.pathname.slice(0, -linkToCurrEndpoint.pathname.split('/').pop().length - 2)
    const links: Link[] = [];
    for (let option of selfOptions) {
        option = await changeLinkTypeForNestedLinks(option, 'json', 'application/json');
        links.push({
            rel: 'collection',
            type: option.type,
            href: `${linkToCurrEndpoint}?f=${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the collecton document as ${option.f}`,
        });
    };
    for (let option of altOptions) {
        option = await changeLinkTypeForNestedLinks(option, 'json', 'application/json');
        links.push({
            rel: 'collection',
            href: `${linkToCurrEndpoint}?f${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the collection document as ${option.f}`,
            type: option.type
        });
    }
    //http://
    return links;
};

export async function createLinksToItemsFromCollection(context: ExegesisContext, selfOptions: ContentNegotiationObject[], altOptions: ContentNegotiationObject[]) {
    const linkToCurrEndpoint = await createUrlToCurrentEndpoint(context);
    let links: Link[];
    for (let option of selfOptions) {
        option = await changeLinkTypeForNestedLinks(option, 'json', 'application/geo+json');
        links.push({
            rel: 'items',
            type: option.type,
            href: `${linkToCurrEndpoint}/items?f=${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View the items included in this collection as ${option.f}`
        });
    };
    for (let option of altOptions) {
        option = await changeLinkTypeForNestedLinks(option, 'json', 'application/geo+json');
        links.push({
            rel: 'items',
            type: option.type,
            href: `${linkToCurrEndpoint}/items?f=${option.f + await addApiKeyToQueryParamString(context)}`,
            title: `View items included in this collection as ${option.f}`
        });
    };
    return links;
}