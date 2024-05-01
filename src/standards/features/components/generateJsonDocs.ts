/**
 * This file contains functions to compile several other documents into what is required by the endpoint
 */

import { ExegesisContext } from "exegesis-express";
import {
  F_AssociatedType,
  Feature,
  FeatureCollection,
  Link,
} from "../../../types";
import { genLinksAll, genLinksToColl_ItemsWhenAtRoot } from "./links";
import initCommonQueryParams from "./params";
import { CollectionConfig } from "..";
import { querySpatialExtent, queryTemporalIntervals } from "./db_queries";
import { crs84Uri, crs84hUri, supportedcrs_array, trs } from "../crsconfig";

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

async function genFeatureCollection(
  context: ExegesisContext,
  featuresArray: Feature[],
  count: number,
  allowed_f_values: F_AssociatedType[]
): Promise<FeatureCollection> {
  //In order to reduce complexity in generating links (rel=(next|prev)), just remove link obj where hasNextPage|prev=false
  let links = await genLinksAll(context, allowed_f_values, "Items");
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

  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberReturned: featuresArray.length,
    numberMatched: await numMatchedInit(count, offset, limit),
    features: featuresArray,
    links: links,
  };
}

async function genConformance(
  context: ExegesisContext,
  conformanceClasses: string[],
  allowed_f_values: F_AssociatedType[]
) {
  return {
    conformsTo: conformanceClasses,
    links: await genLinksAll(context, allowed_f_values, "Conformance"),
  };
}
async function genRootDoc(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
) {
  const doc = {
    title: "Root of the features implementation instance",
    links: await genLinksAll(context, allowed_f_values, "Root"),
  };
  return doc;
}

/**
 * @function genCollectionsDoc
 */
interface Collection {
  id: string | number;
  title?: string;
  description?: string;
  extent: {
    spatial: {
      bbox:
        | [number, number, number, number][]
        | [number, number, number, number, number, number][];
      crs: string;
    };
    temporal: {
      interval: [number, number][] | [null, null][];
      trs: string;
    };
  };
  itemType: "feature";
  crs: string[];
  storageCrs: string;
  storageCrsCoordinateEpoch?: number;
  links: Link[];
}
async function genOneCollectionDoc(
  context: ExegesisContext,
  allowed_f_values: F_AssociatedType[],
  collectionOptions: CollectionConfig,
  mode: "root" | "specific"
): Promise<Collection> {
  const _extentbbox = await querySpatialExtent(
    collectionOptions.modelName,
    collectionOptions.bboxgenScope
  );
  const _extent_interval = await queryTemporalIntervals(
    collectionOptions.modelName,
    collectionOptions.datetimeColumns
  );

  return {
    id: collectionOptions.collectionId,
    extent: {
      spatial: {
        bbox: _extentbbox,
        crs: _extentbbox[0].length === 4 ? crs84Uri : crs84hUri,
      },
      temporal: {
        interval: _extent_interval,
        trs: trs,
      },
    },
    crs:
      _extentbbox[0].length === 4
        ? [
            crs84Uri,
            ...supportedcrs_array.filter(
              (string) => string !== crs84Uri && string !== crs84hUri
            ),
          ]
        : [
            crs84hUri,
            ...supportedcrs_array.filter((string) => string !== crs84hUri),
          ],
    itemType: "feature",
    storageCrs: _extentbbox[0].length > 4 ? crs84hUri : crs84Uri,
    links:
      mode === "specific"
        ? await genLinksAll(context, allowed_f_values, "Collection")
        : await genLinksToColl_ItemsWhenAtRoot(
            context,
            collectionOptions.collectionId,
            allowed_f_values
          ),
  };
}

/**
 * @function genCollectionsRootDoc
 */
interface AllCollections {
  title?: string;
  links?: Link[];
  collections: Collection[];
}
async function genCollectionsRootDoc(
  context: ExegesisContext,
  collections: CollectionConfig[],
  allowed_F_values: F_AssociatedType[]
): Promise<AllCollections> {
  const _allCollections: Collection[] = [];
  for (const collectionOption of collections) {
    _allCollections.push(
      await genOneCollectionDoc(
        context,
        allowed_F_values,
        collectionOption,
        "root"
      )
    );
  }

  return {
    title: "All collections",
    collections: _allCollections,
    links: await genLinksAll(context, allowed_F_values, "collectionsRoot"),
  };
}
export {
  genRootDoc,
  genFeatureCollection,
  genConformance,
  genOneCollectionDoc,
  genCollectionsRootDoc,
};
