import { ExegesisContext } from "exegesis-express";
import convertJsonToYAML from "../../standards/features/components/convertToYaml";

export default async function helloWorld (context: ExegesisContext) {
  const response = { message: "Hello World! \n This is a test route \n Serviced by exegesis" };
  context.res
    .status(200)
    .set("content-type", "text/yaml")
    .setBody(await convertJsonToYAML(response));
};
