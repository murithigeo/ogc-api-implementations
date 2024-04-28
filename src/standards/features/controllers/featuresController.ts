import { ExegesisContext } from "exegesis-express";
import validateQueryParams from "../../../components/validateQueryParameters";
import sequelize from "../../../dbconnection";
import { httpMessages } from "../../../httpMessages";
import parseDbResToGeoJson from "../components/parsedbResToGeoJson";
import { F_AssociatedType, RawGeoDataResult } from "../../../types";
import {
  genLinksForFeatureCollection,
  genLinksForRoot,
} from "../components/links";
import initCommonQueryParams from "../components/params";

exports.getItems = async function (context: ExegesisContext) {
  const {
    limit,
    offset,
    contentcrsHeader,
    bboxArray,
    bboxcrs_vArray,
    crs_vArray,
    unexpectedParamsRes,
    invalidcrsbboxRes,
    flipCoords,
  } = await initCommonQueryParams(context);

  const contentNegotiation_Values: F_AssociatedType[] = [
    { f: "json", type: "application/geo+json" },
    { f: "html", type: "text/html" },
  ];
  //const queryParamsToIgnore: string[] = ['offset', 'f'];
  //console.log(context.api.)
  const v = await genLinksForFeatureCollection(
    context,
    contentNegotiation_Values
  );
  console.log(v);
  context.res
    .status(200)
    .set("content-type", "application/json")
    .setBody(v && v);
};

exports.getItem = async function (context: ExegesisContext) {
  const { crs_vArray, unexpectedParamsRes } = await initCommonQueryParams(context);
  if (crs_vArray.length < 1) {
    /*
    if (unexpectedParams.length > 0) {
      context.res
        .status(400)
        .setBody(`Unexpected Query Parameters detected: ${unexpectedParams}`);
    }
    */
    if (crs_vArray.length < 1) {
      context.res
        .status(400)
        .setBody(`Invalid crs Requested: ${context.params.query.crs}`);
    }
  } else {
  }
};
