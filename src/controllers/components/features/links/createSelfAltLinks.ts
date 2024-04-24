import { ExegesisContext } from "exegesis-express";
import { ContentNegotiationObject } from "../params/f";
import { Link } from "../../../../types";
import createUrlToCurrentEndpoint from "./createUrlToCurrentEndpoint";

export default async function createSelfAltLinks(context: ExegesisContext, selfOptions: ContentNegotiationObject[], alternateOptions: ContentNegotiationObject[], queryString: string): Promise<Link[]> {
    const linkToCurrentResource = await createUrlToCurrentEndpoint(context);
    let links: Link[] = [];

    /**
     * Generate links for all objects in the @selfOptions Array
     */
    for (const option of selfOptions) {
        //queryString += `&f=${option.f}`
        links.push({
            rel: 'self',
            title: `This document as ${option.f}`,
            href: `${linkToCurrentResource + queryString}&f=${option.f}`,
            type: option.type
        });
    };
    for (const option of alternateOptions) {
        //queryString += `&f=${option.f}`;
        //console.log(queryString)
        links.push({
            rel: 'alternate',
            title: `This document as ${option.f}`,
            href: `${linkToCurrentResource + queryString}&f=${option.f}`,
            type: option.type
        });
    };
    return links;
}