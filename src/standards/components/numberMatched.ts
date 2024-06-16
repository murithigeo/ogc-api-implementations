import { ExegesisContext } from "exegesis-express";
import edrCommonParams from "../components/params";

export default async function numMatchedInit(
  ctx: ExegesisContext,
  count: number
): Promise<number> {
  const { limit, offset } = await edrCommonParams(ctx);
  let numberMatched: number = 0;
  const startIndex = Math.min(offset, count);
  const endIndex = Math.min(startIndex + limit, count);
  numberMatched += endIndex - startIndex;
  return numberMatched;
}
