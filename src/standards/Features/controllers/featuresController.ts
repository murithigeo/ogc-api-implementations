import { ExegesisContext } from "exegesis-express";
import { validateIncomingCrs_BboxCrs } from "../components/params/crs";
import validateQueryParams from "../../../components/validateQueryParameters";

exports.getItems = async function (context: ExegesisContext) {
    const  { flipCoords }= await validateIncomingCrs_BboxCrs(context);
    const unexpectedParams = await validateQueryParams(context);
    console.log(unexpectedParams)
    if(unexpectedParams.length>0){
        context.res.status(400).setBody(`Incorrect query parameters: ${JSON.stringify(unexpectedParams)}`)
    }
}

exports.getItem = async function (context: ExegesisContext) {

}