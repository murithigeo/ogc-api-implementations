import { ExegesisContext } from "exegesis-express";
import { genConformance } from "../components/generateJsonDocs";
import { F_AssociatedType } from "../../../types";
import initCommonQueryParams from "../components/params";
import convertJsonToYAML from "../components/convertToYaml";
import { allowed_F_values } from "..";

 export async function getConformance (context: ExegesisContext) {
  const { f } = await initCommonQueryParams(context);
  const conformanceClasses: string[] = [
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
    "http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs",
  ];

  const _jsonDoc = await genConformance(
    context,
    conformanceClasses,
    allowed_F_values
  );
  switch (f) {
    case "json":
      context.res
      .status(200)
      .set("content-type","application/json")
      .setBody(_jsonDoc);
      break;
    case "yaml":
      context.res.status(200).setBody(await convertJsonToYAML(_jsonDoc));
      break;
    default:
      context.res.status(400).setBody("");
  }
};
