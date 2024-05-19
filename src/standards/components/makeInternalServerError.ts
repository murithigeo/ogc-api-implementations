import { ExegesisContext, ExegesisPluginContext } from "exegesis-express";

export default async function return500InternalServerErr(
  ctx: ExegesisContext | ExegesisPluginContext
) {
  return ctx.makeError(500, "Internal server error");
}
