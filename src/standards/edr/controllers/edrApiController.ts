import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";
import { edrDocument } from "..";
import genScalarUi from "../../components/scalarUi";

async function edrGetServiceDesc(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .set("content-type", "text/html")
    .setBody(await genScalarUi(await edrDocument));
}

async function edrGetServiceDoc(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .set("content-type", "application/vnd.oai.openapi+json;version=3.0")
    .setBody(await edrDocument);
}

export { edrGetServiceDesc, edrGetServiceDoc };
