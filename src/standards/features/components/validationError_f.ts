import { ExegesisContext } from "exegesis-express";

async function genValidationErrorFor_F(context: ExegesisContext) {
  return context.makeValidationError("invalid query param [f]", {
    in: "query",
    name: "f",
    docPath: context.api.pathItemPtr,
  });
}

export default genValidationErrorFor_F