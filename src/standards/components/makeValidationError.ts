import { ExegesisContext, ExegesisPluginContext } from "exegesis-express";

export default async function makeQueryValidationError(
  ctx: ExegesisContext | ExegesisPluginContext,
  paramName?: string,
  message?: string
) {
  return ctx.makeValidationError(message ?? "ValidationError", {
    in: "query",
    name: paramName ?? "f",
    docPath: ctx.api.pathItemPtr,
  });
  //console.log(res)
}
