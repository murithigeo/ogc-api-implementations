import { ExegesisContext } from "exegesis-express";
import self_altLinksFunc from "./self_altLinks";
import { ContentNegotiationArray } from "../../types";

export default async function featureLink(
  ctx: ExegesisContext,
  allowedCNvals: ContentNegotiationArray
) {
  return await self_altLinksFunc(ctx, allowedCNvals);
}
