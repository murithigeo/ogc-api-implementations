import { ExegesisContext } from "exegesis-express";
import { ContentNegotiationObject } from "../params/f";
import coreServerQueryParams from "../params";
import verifyHas_NextPrevStatus from "./verifyPrevNextLinksInclusion";
import createUrlToCurrentEndpoint from "./createUrlToCurrentEndpoint";
import { Link } from "../../../../types";

export default async function createPrevNextLinks(context: ExegesisContext, count: number, selfOptions: ContentNegotiationObject[], queryString: string) {
    let { hasNextPage, hasPrevPage, limit, offset, nextPageOffset, prevPageOffset } = await coreServerQueryParams(context);
    const linkToCurrentEndpoint = await createUrlToCurrentEndpoint(context);

    console.log(`_hasNextPage: ${hasNextPage}`)
    console.log(`_hasPrevPage: ${hasPrevPage}`) 
    //Ensure that boolean conditions for including prev & next links are mutated if they meet the conditions
    hasNextPage = (await verifyHas_NextPrevStatus(context, count)).hasNextPage;
    hasPrevPage = (await verifyHas_NextPrevStatus(context, count)).hasPrevPage;

    console.log(`hasNextPage: ${hasNextPage}`)
    console.log(`hasPrevPage: ${hasPrevPage}`)

    let links: Link[] = []
    //
    if (hasPrevPage === true) {
        queryString += `&offset=${prevPageOffset}&limit=${limit}`
        for (const option of selfOptions) {
            links.push({
                rel: `prev`,
                title: `Previous page of results`,
                href: `${linkToCurrentEndpoint + queryString}& f=${option.f} `,
                type: option.type
            });
        };
        if (hasNextPage === true) {
            queryString += `& offset=${nextPageOffset}& limit=${limit} `
            for (const option of selfOptions) {
                links.push({
                    rel: 'next',
                    title: `Next page of results`,
                    href: `${linkToCurrentEndpoint + queryString}& f=${option.f} `,
                    type: option.type
                });
            }
        };
    };
    return links;
};