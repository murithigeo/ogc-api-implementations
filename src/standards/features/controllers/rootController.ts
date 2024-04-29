import { ExegesisContext } from "exegesis-express";
import { genLinksForRoot } from "../components/links";
import initCommonQueryParams from "../components/params";
import YAML from "js-yaml";
import { CN_Value } from "../../../types";

exports.getLandingPage = async function (context: ExegesisContext) {
  const { f, urlToThisEP } = await initCommonQueryParams(
    context
  );

  //Promise.resolve(validateQueryParams(context));
  //if(typeof f!==('json'||'yaml'))
  const links = await genLinksForRoot(context, [
    { f: "json", type: "application/json" },
    { f: "yaml", type: "application/yaml" },
    { f: "html", type: "text/html" },
  ]);
  /*
  switch (f) {
    case "json":
      context.res
        .status(200)
        .set(`content-type`, `application/json`)
        .setBody(links);
      break;
    case "yaml":
      context.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(YAML.dump(links, { lineWidth: -1 }));
      break;
    default:
      console.log(`default reached`);
    //context.makeError(400, "Invalid parameter value" + f);
  }
  */
};
