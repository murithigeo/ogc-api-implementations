import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../features/components/convertToYaml";

async function edrGetRoot(context: ExegesisContext) {
  context.res
    .status(200)
    .set("content-type", "text/yaml")
    .setBody(await convertJsonToYAML({ message: "This is the landingpage for /edr" }));
}


export default edrGetRoot