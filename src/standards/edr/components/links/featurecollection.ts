import { ExegesisContext } from "exegesis-express";
import self_altLinksFunc from "./self_altLinks";
import { ContentNegotiationArray } from "../../types";
import edrCommonParams from "../../../components/params";
import { filterAllowedContentTypes } from "./helpers";

export default async function featureCollectionLinks(
  ctx: ExegesisContext,
  allowedCNvals: ContentNegotiationArray
) {
  const links = await self_altLinksFunc(ctx, allowedCNvals);
  //Next and prev links
  const { _url, offset, limit } = await edrCommonParams(ctx);

  const { optionsForSelf } = await filterAllowedContentTypes(
    ctx,
    allowedCNvals
  );
  for (const cnVal of optionsForSelf) {
    _url.searchParams.set("f", cnVal.f);
    _url.searchParams.set("offset", (offset + limit).toString());
    links.push({
      title: "Next page of results",
      href: _url.toString(),
      rel: "next",
      type: cnVal.contentType,
    });
    _url.searchParams.set("f", cnVal.f);
    _url.searchParams.set("offset", (offset - limit).toString());
    links.push({
      title: "Prev page of results",
      href: _url.toString(),
      rel: "prev",
      type: cnVal.contentType,
    });
  }
  return links;
}
