import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";
import { EDRConformancePage } from "../types";
import makeQueryValidationError from "../../components/makeValidationError";

async function edrGetConformance(ctx: ExegesisContext) {
  const confClasses: EDRConformancePage = {
    conformsTo: [
      "http://www.opengis.net/spec/ogcapi-edr-1/1.0/conf/core",
      "http://www.opengis.net/spec/ogcapi-common-1/1.0/conf/core",
      "http://www.opengis.net/spec/ogcapi-common-2/1.0/conf/collections", //Collections
      "http://www.opengis.net/spec/ogcapi-edr-1/1.0/conf/oas30", //Serves OasDoc @ {root}/api
      //"http://www.opengis.net/spec/ogcapi-edr-1/1.0/conf/html", //Provides HTML content. Preferable for html content
      "http://www.opengis.net/spec/ogcapi-edr-1/1.0/conf/geojson", //Serves geojson content
    ],
    links: [], //None added yet
  };
  switch (ctx.params.query.f) {
    case "json":
      ctx.res
        .status(200)
        .set("content-type", "application/json")
        .json(confClasses);
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(confClasses));
      break;
    default:
      ctx.res.status(400).json(await makeQueryValidationError(ctx, "f"));
  }
}

export default edrGetConformance;
