import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../standards/components/convertToYaml";

export default async function helloWorld (ctx: ExegesisContext) {
  const response = { message: "Hello World! \n This is a test route \n Serviced by exegesis" };
  ctx.res
    .status(200)
    .set("content-type", "text/yaml")
    .setBody(await convertJsonToYAML(response));
};
