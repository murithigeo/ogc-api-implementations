import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";
import { edrDocument } from "..";
import genScalarUi from "../../components/scalarUi";
import makeQueryValidationError from "../../components/makeValidationError";

/**
 * @function edrGetServiceDesc returns a OpenAPI 3.0.(3) document in JSON/YAML
 * @param ctx
 */

async function edrGetServiceDesc(ctx: ExegesisContext) {
  switch (ctx.params.query.f) {
    case "json":
      ctx.res
        .status(200)
        .set("content-type", "application/vnd.oai.openapi+json;version=3.0")
        .setBody(await edrDocument)
        .end();
      break;
    case "yaml":
      ctx.res
        .status(200)
        .set("content-type", "text/yaml")
        .setBody(await convertJsonToYAML(await edrDocument))
        .end();
      break;
    default:
      ctx.res
        .status(400)
        .json(await makeQueryValidationError(ctx, "f"))
        .end();
  }
}

/**
 * @function edrGetServiceDoc Generates a web console that devs can use to interact with client
 * @uses Scalar because it is lightweight and almost all content is served through CDN
 * @param ctx
 */
async function edrGetServiceDoc(ctx: ExegesisContext) {
  const code = await genScalarUi(await edrDocument);

  ctx.res.status(200).set("content-type", "text/html").setBody(code);
}

export { edrGetServiceDesc, edrGetServiceDoc };
