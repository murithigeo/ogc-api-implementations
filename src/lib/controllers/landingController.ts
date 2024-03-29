import { ExegesisContext } from "exegesis";


exports.getLanding = async function (context:ExegesisContext){
    context.res.status(200).setBody({message: 'Welcome to the OGC API - Features implementation!'})
}