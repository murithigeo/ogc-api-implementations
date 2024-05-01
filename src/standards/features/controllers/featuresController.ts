import { ExegesisContext } from "exegesis-express";
import sequelize from "../../../dbconnection";
import { httpMessages } from "../../../httpMessages";
import parseDbResToGeoJson from "../components/parsedbResToGeoJson";
import { F_AssociatedType, RawGeoDataResult } from "../../../types";

import initCommonQueryParams from "../components/params";
import { genFeatureCollection } from "../components/generateJsonDocs";
import { allowed_F_values } from "..";
import { genLinksAll } from "../components/links";
import { ReadableStream } from "stream/web";

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

  const _fcDoc = await genFeatureCollection(context, [], 0, allowed_F_values);

  
  const stream= ReadableStream.from(JSON.stringify(_fcDoc.links))
  context.res
  .status(200)
  .set("content-type", "application/geo+json")
  .setBody(stream)
};

exports.getItem = async function (context: ExegesisContext) {
  //const { crs_vArray } = await initCommonQueryParams(context);

  const links = await genLinksAll(context, allowed_F_values, "Feature");
  context.res.status(200).setBody(links)
};
