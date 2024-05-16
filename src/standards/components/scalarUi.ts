export default async function genScalarUi(doc: object) {
  return `<!doctype html>
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
    ${JSON.stringify(doc)}    
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
}
