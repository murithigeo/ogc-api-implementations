import { ExegesisContext } from "exegesis-express";
import { URL } from "url";

async function genUrlToRequestedEndpoint(context: ExegesisContext) {
    /**
     * @var context.api.serverObject is the server against which the query was run. Document must therefore have servers array
     */
  let url = new URL(context.api.serverObject.url + context.req.url);

  //Remove the search params
  url.search = "";

  return url;
};

async function addQuey(context:ExegesisContext){
    
    for (const [k,v] of Object.entries(context.params.query)){
    };
};

async function genSelfAltLinks(context:ExegesisContext){
    
}
async function createPrevNextLinks(){
    
}