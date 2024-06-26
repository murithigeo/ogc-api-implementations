import YAML from "js-yaml";
import { ExegesisContext } from "exegesis-express";
import initCommonQueryParams from "../components/params";
import { featuresOasDoc } from "..";

async function getServiceDoc(context: ExegesisContext) {
  const oasDoc = await featuresOasDoc;

  const scalarCode = `<!doctype html>
    <html>
    <head>
    <title>API Reference</title>
    '<meta charset=utf-8 />'
    <meta
    'name=viewport'
    'content = width=device-width, initial-scale=1 />'
    <style>
    body {
    margin: 0;
    }
    </style >
    </head >
    <body>
    <script 
    id="api-reference"
    type="application/json"
    >
    ${JSON.stringify(oasDoc)}    
    </script>
    <script>
    var scalarConfigOptions = {
      isEditable: false,
      layout: "modern",
      theme: "bluePlanet",
      showSidebar: false,
    };
    var apiReference= document.getElementById('api-reference');
    apiReference.dataset.configuration= JSON.stringify(scalarConfigOptions);
    </script>
    <script src=https://cdn.jsdelivr.net/npm/@scalar/api-reference></script>
    </body>
    </html>`;
  context.res.status(200).set(`Content-type`, "text/html").setBody(scalarCode);
}

async function getServiceDesc(context: ExegesisContext) {
  const oasDoc = await featuresOasDoc;
  context.res
    .status(200)
    .set("content-type", "application/vnd.oai.openapi+json;version=3.0")
    .setBody(oasDoc);
}

export { getServiceDesc, getServiceDoc };
