import { ExegesisContext } from "exegesis-express";
import { genConformance } from "../components/generateJsonDocs";
import { F_AssociatedType } from "../../../types";
import initCommonQueryParams from "../../components/params";
import convertJsonToYAML from "../../components/convertToYaml";
import { allowed_F_values } from "..";

 export default async function getConformance (ctx: ExegesisContext) {
  const conformanceClasses: string[] = [
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson",
    "http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs",
  ];

  const _jsonDoc = await genConformance(
    ctx,
    conformanceClasses,
    allowed_F_values
  );
  switch (ctx.params.query.f) {
    case "json":
      ctx.res
      .status(200)
      .set("content-type","application/json")
      .setBody(_jsonDoc);
      break;
    case "yaml":
      ctx.res.status(200).setBody(await convertJsonToYAML(_jsonDoc));
      break;
    default:
      ctx.res.status(400).setBody("");
  }
};
