/**
 * This file contains functions to compile several other documents into what is required by the endpoint
 */

import { ExegesisContext } from "exegesis-express";
import { Feature, FeatureCollection } from "../../../types";
import { genLinksForFeatureCollection } from "./links";
import initCommonQueryParams from "./params";

async function numMatchedInit(
  count: number,
  offset: number,
  limit: number
): Promise<number> {
  let numberMatched: number = 0;
  const startIndex = Math.min(offset, count);
  const endIndex = Math.min(startIndex + limit, count);
  numberMatched += endIndex - startIndex;
  return numberMatched;
}
export async function genFeatureCollection(
  context: ExegesisContext,
  featuresArray: Feature[],
  count: number
):Promise<FeatureCollection> {
  //In order to reduce complexity in generating links (rel=(next|prev)), just remove link obj where hasNextPage|prev=false
  let links = await genLinksForFeatureCollection(context, [
    { f: "json", type: "application/geo+json" },
    { f: "html", type: "text/html" },
    { f: "yaml", type: "application/yaml" },
  ]);
  const { offset, limit } = await initCommonQueryParams(context);
  let hasNextPage: boolean, hasPrevPage: boolean;
  hasPrevPage = offset < 1 || count - limit - offset <= 0 ? false : true;
  hasNextPage = count <= 1 ? false : true;

  if (hasNextPage === false) {
    links = links.filter((obj) => obj.rel !== "next");
  }
  if (hasPrevPage === false) {
    links = links.filter((obj) => obj.rel !== "prev");
  }

  const featurecollection: FeatureCollection = {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberReturned: featuresArray.length,
    numberMatched: await numMatchedInit(count, offset, limit),
    features: featuresArray,
    links: links,
  };
  return featurecollection;
}
