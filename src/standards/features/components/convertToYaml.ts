import YAML from "js-yaml";

async function convertJsonToYAML(doc) {
    //Disallow long text from being appended with >-
  const yamlOptions: YAML.DumpOptions = { lineWidth: -1 };
  return YAML.dump(doc, yamlOptions);
}


export default convertJsonToYAML