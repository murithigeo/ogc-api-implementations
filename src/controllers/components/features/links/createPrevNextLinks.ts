import { ExegesisContext } from "exegesis-express";
import { ContentNegotiationObject } from "../params/f";
import coreServerQueryParams from "../params";
import createUrlToCurrentEndpoint from "./createUrlToCurrentEndpoint";
import { Link } from "../../../../types";

export default async function createPrevNextLinks(
  context: ExegesisContext,
  count: number,
  selfOptions: ContentNegotiationObject[],
  queryString: string
) {
  let { limit, offset, nextPageOffset, prevPageOffset } =
    await coreServerQueryParams(context);
  const linkToCurrentEndpoint = await createUrlToCurrentEndpoint(context);

  let hasNextPage: boolean, hasPrevPage: boolean;

  /**
   * @math prevPageOffset=offset-limit
   * if count-prevPageOffset<1 it means that there are no records that have been skipped
   * Furthermore, if offset <1 it means that no records have been skipped
   */
  hasPrevPage = offset < 1 || count - limit - offset <= 0 ? false : true;
  hasNextPage = count <= 1 ? false : true;

  //     console.log(`_hasNextPage: ${hasNextPage}`)
  ///console.log(`_hasPrevPage: ${hasPrevPage}`)
  //Ensure that boolean conditions for including prev & next links are mutated if they meet the conditions

  console.log(`hasNextPage: ${hasNextPage}`);
  console.log(`hasPrevPage: ${hasPrevPage}`);

  let links: Link[] = [];
  //
  if (hasPrevPage === true) {
    const url = new URL(linkToCurrentEndpoint + queryString);
    url.searchParams.set("offset", `${prevPageOffset}`);
    //url.searchParams.set("f",`${option.}`)
    //queryString += `&offset=${prevPageOffset}&limit=${limit}`
    for (const option of selfOptions) {
      url.searchParams.set("f", `${option.f}`);
      links.push({
        rel: `prev`,
        title: `Previous page of results`,
        href: url.toString(),
        type: option.type,
      });
    }
  }
  if (hasNextPage === true) {
    const url = new URL(linkToCurrentEndpoint + queryString);
    //queryString += `&offset=${nextPageOffset}`;
    url.searchParams.set("offset", `${nextPageOffset}`);
    for (const option of selfOptions) {
        url.searchParams.set('f',`${option.f}`);
      links.push({
        rel: "next",
        title: `Next page of results`,
        href: url.toString(),
        type: option.type,
      });
    }
  }
  return links;
}
