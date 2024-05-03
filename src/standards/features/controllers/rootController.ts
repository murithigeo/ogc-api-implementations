import { ExegesisContext } from "exegesis-express";
import initCommonQueryParams from "../components/params";
import { CN_Value, F_AssociatedType } from "../../../types";
import { genRootDoc } from "../components/generateJsonDocs";
import convertJsonToYAML from "../components/convertToYaml";
import { allowed_F_values } from "..";

exports.getLandingPage = async function (context: ExegesisContext) {
  const { f } = await initCommonQueryParams(context);
  const _jsonDoc = await genRootDoc(context, allowed_F_values);

  switch (f) {
    case "json":
      context.res
        .status(200)
        .set("content-type", "application/json")
        .setBody(_jsonDoc);
      break;
    case "yaml":
      context.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(_jsonDoc));
      break;
    default:
      context.res.status(400).setBody('t')
  }
};
