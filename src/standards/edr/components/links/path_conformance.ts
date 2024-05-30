import { ExegesisContext } from "exegesis-express";
import { ContentNegotiationArray } from "../../types";
import self_altLinksFunc from "./self_altLinks";

const edrConformanceLinks = async (
  ctx: ExegesisContext,
  allowedCNvals: ContentNegotiationArray
) => await self_altLinksFunc(ctx, allowedCNvals);

export default edrConformanceLinks;
