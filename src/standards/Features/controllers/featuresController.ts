import { ExegesisContext } from "exegesis-express";
import { validateIncomingCrs_BboxCrs } from "../components/params/crs_operations";
import validateQueryParams from "../../../components/validateQueryParameters";
import sequelize from "../../../dbconnection";
import coreServerQueryParams from "../components/params";
import { httpMessages } from "../../../httpMessages";
import { retrieveItems } from "../components/db_functions/dbActions";
import { parseGeoJson } from "../components/parseGeoJson";
import { RawGeoDataResult } from "../../../types";
import { generateLinks } from "../components/links";

exports.getItems = async function (context: ExegesisContext) {
    const { limit, offset, contentcrsHeader, bbox, validated_bboxcrs, validated_crs, unexpectedParams, flipCoords } = await coreServerQueryParams(context);
    if (unexpectedParams.length > 0 || (validated_crs || validated_bboxcrs).length < 1) {
        if (unexpectedParams.length > 0) {
            context.res.status(400).setBody({ message: `Unexpected/Invalid Parameters Included: ${unexpectedParams}` });
        };
        if (validated_crs.length < 1) {
            context.res.status(400).setBody({ message: `Invalid Coord. Ref. Sys. Param (crs) Requested :${context.params.query.crs}` });
        };
        if (validated_bboxcrs.length < 1) {
            context.res.status(400).setBody({ message: `Invalid bbox Coord. Ref. Sys. Param ('bbox-crs') Requested: ${context.params.query['bbox-crs']}` })
        }
    } else {
        try {
            const v =await generateLinks('specificCollection', context, 'collection')

            const { count, rows } = await retrieveItems(context);
            const featuresAray = await parseGeoJson(rows as unknown as RawGeoDataResult[], 'geom', 'id');
            console.log(v)
        } catch (err) {
            context.res.status(500).setBody(httpMessages.resources[500]);
        }
    }

}

exports.getItem = async function (context: ExegesisContext) {
    const { validated_crs, unexpectedParams } = await coreServerQueryParams(context);
    if (unexpectedParams.length > 0 || validated_crs.length < 1) {
        if (unexpectedParams.length > 0) {
            context.res.status(400).setBody(`Unexpected Query Parameters detected: ${unexpectedParams}`);
        }
        if (validated_crs.length < 1) {
            context.res.status(400).setBody(`Invalid crs Requested: ${context.params.query.crs}`);
        }
    } else {
        try {
            const { count, rows } = await retrieveItems(context, 'id');
            if (count < 1 || rows.length < 1) {
                context.res.status(404).setBody(httpMessages.resources[404]);
            } else {
                const featureInArray = await parseGeoJson(rows as unknown as RawGeoDataResult[], 'geom', 'id');
            }
        } catch (err) {
            context.res.status(500).setBody(httpMessages.resources[500]);
        }
    }
}