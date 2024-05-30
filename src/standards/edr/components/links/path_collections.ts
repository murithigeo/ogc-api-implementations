import { ExegesisContext } from "exegesis-express";
import * as types from "../../types";
import self_altLinksFunc from "./self_altLinks";
import { Link } from "../../../../types";
import * as linkHelpers from "../links/helpers";
export const edrCollectionsInstancesRoot = async (
  ctx: ExegesisContext,
  allowedCNvals: types.ContentNegotiationArray
) => await self_altLinksFunc(ctx, allowedCNvals);

export const edrCollectionSpecificLink_Root = async (
  ctx: ExegesisContext,
  allowedCNvals: types.ContentNegotiationArray
) => {
  //Assumes path is same as above
  const links: Link[] = [];
  const { optionsForSelf } = await linkHelpers.filterAllowedContentTypes(
    ctx,
    allowedCNvals
  );
  for (const cnVal of optionsForSelf) {
    links.push({
      title: `View the collection resource as ${cnVal.f}`,
      href: await linkHelpers.appendLocation(
        ctx,
        ctx.params.path.instanceId
          ? "/" + ctx.params.path.instanceId
          : "/" + ctx.params.path.collectionId,
        cnVal
      ),
      rel: "data",
      type: cnVal.contentType,
    });
  }
  return links;
};
