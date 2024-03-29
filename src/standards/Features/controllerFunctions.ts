import { ExegesisContext } from "exegesis";

export async function getFeatures_Funcs(context: ExegesisContext) {
context.res.status(200).setBody({message: 'cf Successfully defined an external func for controller'});

}

export async function getOneFeature_Funcs(context: ExegesisContext) {
context.res.status(200).setBody({message: 'Successfully defined an external func {featureId} for controller'})
}