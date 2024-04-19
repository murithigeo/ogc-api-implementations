import { ExegesisContext } from "exegesis-express";
import { validateIncomingCrs_BboxCrs } from "../components/params/crs_operations";
import validateQueryParams from "../../../components/validateQueryParameters";
import { HFICModel } from "../components/db_functions/dbActions";
import sequelize from "../../../dbconnection";

exports.getItems = async function (context: ExegesisContext) {
    const { flipCoords } = await validateIncomingCrs_BboxCrs(context);
    const unexpectedParams = await validateQueryParams(context);
    console.log(unexpectedParams)
    if (unexpectedParams.length > 0) {
        context.res.status(400).setBody(`Incorrect query parameters: ${JSON.stringify(unexpectedParams)}`)
    }
}

exports.getItem = async function (context: ExegesisContext) {
    const model = HFICModel(sequelize);
    model.findAll();
}