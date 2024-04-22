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
    for (const selfLinkConfigObj of selfOptions) {
        links.push({
            rel: 'self',
            title: `This document as ${selfLinkConfigObj.f}`,
            href: `${linkToCurrentResource + queryString}`,
            type: selfLinkConfigObj.type
        });
    };
    for (const altLinkConfigObj of alternateOptions) {
        links.push({
            rel: 'alternate',
            title: `This document as ${altLinkConfigObj.f}`,
            href: `${linkToCurrentResource + queryString}`,
            type: altLinkConfigObj.type
        });
    };
    return links;
}