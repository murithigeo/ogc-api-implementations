import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import edrCommonParams from "../params";
import self_altLinksFunc from "./self_altLinks";
import * as linkHelpers from "./helpers";
import { Url } from "url";

/**
 * @description Generate links for endpoints: /api /api.html /conformance /collections
 * @returns types.Link[]
 */


const edrRootLinks = async (
  ctx: ExegesisContext,
  contentNegotiationValues: types.ContentNegotiationArray
) => {
  //assumes the link is like this http://(domain+port)/edr

  //self/alternate
  const links = await self_altLinksFunc(ctx, contentNegotiationValues);

  const optionsForSelf = (await linkHelpers.filterAllowedContentTypes(ctx, contentNegotiationValues))
    .optionsForSelf;
  for (const cnVal of optionsForSelf) {
    links.push({
      title: `View conformance resource as ${cnVal.f}`,
      href: await linkHelpers.appendLocation(ctx, "conformance", cnVal),
      type: cnVal.contentType,
      rel: "conformance",
    });
    links.push({
      title: `View the Api Definition Document as ${cnVal.f}`,
      href: await linkHelpers.appendLocation(ctx, "api", cnVal),
      type:
        ctx.params.query.f === "json"
          ? "application/vnd.oai.openapi+json;version=3.0"
          : cnVal.contentType,
      rel: "service-desc",
    });
    links.push({
      title: `View the interactive web console for the server`,
      href: await linkHelpers.appendLocation(ctx, "api.html", cnVal),
      type: `text/html`,
      rel: "service-doc",
    });
    links.push({
      title: `View the collections as ${cnVal.f}`,
      rel: "data",
      href: await linkHelpers.appendLocation(ctx, "collections", cnVal),
      type: cnVal.contentType,
    });
  }
  return links;
};

export default edrRootLinks;
