import { ExegesisContext } from "exegesis-express";
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
    //unexpectedParamsRes,
    //invalidcrsbboxRes,
    flipCoords,
  } = await initCommonQueryParams(context);

  const contentNegotiation_Values: F_AssociatedType[] = [
    { f: "json", type: "application/geo+json" },
    { f: "html", type: "text/html" },
  ];
console.log(context.params.path)

  context.res
    .status(200)
    .set("content-type", "application/json")
    .setBody('c');
};

exports.getItem = async function (context: ExegesisContext) {
  const { crs_vArray,  } = await initCommonQueryParams(context);
  
};
