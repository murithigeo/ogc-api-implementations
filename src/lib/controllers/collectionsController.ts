import { ExegesisContext } from "exegesis";


exports.getCollections = async function (context:ExegesisContext){
    context.res.status(200).setBody({message: 'get Collections'})
}

exports.getOneCollection = async function (context:ExegesisContext){
    context.res.status(200).setBody({message: 'get One Collection'})
}