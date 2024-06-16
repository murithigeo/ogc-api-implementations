import { ExegesisContext } from "exegesis-express";
import initCommonQueryParams from "../../components/params";
import { CN_Value, F_AssociatedType } from "../../../types";
import { genRootDoc } from "../components/generateJsonDocs";
import convertJsonToYAML from "../../components/convertToYaml";
import { allowed_F_values } from "..";

export default async function getFeaturesRoot(ctx: ExegesisContext) {
  const _jsonDoc = await genRootDoc(ctx, allowed_F_values);

  switch (ctx.params.query.f) {
    case "json":
      ctx.res
        .status(200)
        .set("content-type", "application/json")
        .setBody(_jsonDoc);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_jsonDoc));
      break;
    default:
      ctx.res.status(400).setBody("t");
  }
}

