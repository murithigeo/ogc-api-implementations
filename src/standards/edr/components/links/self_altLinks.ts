import { ExegesisContext } from "exegesis-express";
import { ContentNegotiationArray } from "../../types";
import edrCommonParams from "../params";
import * as linkHelpers from "./helpers";
import { Link } from "../../../../types";

/**
 * @description generate link objects where link.rel= "self"||"alt"
 */

const self_altLinksFunc = async (
  ctx: ExegesisContext,
  allowedCNvals: ContentNegotiationArray
) => {
  const { _url } = await edrCommonParams(ctx);
  const { optionsForSelf, optionsForAlt } = await linkHelpers.filterAllowedContentTypes(
    ctx,
    allowedCNvals
  );
  const links: Link[] = [];
  for (const cnVal of optionsForSelf) {
    _url.searchParams.set("f", cnVal.f);
    links.push({
      title: `This document as ${cnVal.f}`,
      rel: "self",
      href: _url.toString(),
      type: cnVal.contentType,
    });
  }
  for (const cnVal of optionsForAlt) {
    _url.searchParams.set("f", cnVal.f);
    links.push({
      title: `This document as ${cnVal.f}`,
      rel: "alternate",
      href: _url.toString(),
      type: cnVal.contentType,
    });
  }
  return links;
};

export default self_altLinksFunc;
