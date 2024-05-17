import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";
import { edrDocument } from "..";
import genScalarUi from "../../components/scalarUi";

async function edrGetServiceDesc(ctx: ExegesisContext) {
  
  ctx.res
    .status(200)
    .set("content-type", "application/vnd.oai.openapi+json;version=3.0")
    .setBody(await edrDocument);
}

async function edrGetServiceDoc(ctx: ExegesisContext) {
  //console.log
  const code = await genScalarUi(await edrDocument);
  //cos
  //console.log(code);
  ctx.res.status(200).set("content-type", "text/html").setBody(code);

}

export { edrGetServiceDesc, edrGetServiceDoc };
