import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";

async function edrGetConformance(ctx: ExegesisContext) {
  ctx.res
    .status(200)
    .set("content-type", "text/yaml")
    .setBody(
      await convertJsonToYAML({
        message: "This is the edrConformance endPoint",
      })
    );
    
}

export default edrGetConformance