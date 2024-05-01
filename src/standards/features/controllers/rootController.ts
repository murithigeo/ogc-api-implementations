import { ExegesisContext } from "exegesis-express";
import initCommonQueryParams from "../components/params";
import { CN_Value, F_AssociatedType } from "../../../types";
import { genRootDoc } from "../components/generateJsonDocs";
import convertJsonToYAML from "../components/convertToYaml";
import genValidationErrorFor_F from "../components/validationError_f";

exports.getLandingPage = async function (context: ExegesisContext) {
  const { f, urlToThisEP } = await initCommonQueryParams(context);
  const allowed_f_values: F_AssociatedType[] = [
    { f: "html", type: "text/html" },
    { f: "json", type: "application/json" },
    { f: "yaml", type: "text/yaml" },
  ];
  const _jsonDoc = await genRootDoc(context, allowed_f_values);
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
      context.res.status(400).setBody(await genValidationErrorFor_F(context));
  }
};
