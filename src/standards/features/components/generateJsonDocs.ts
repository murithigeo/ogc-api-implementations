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
import { CollectionsConfig, CollectionConfig } from "..";
import { querySpatialExtent, queryTemporalIntervals } from "./db_queries";
import * as crsDetails from "../../components/crsdetails";
import numMatchedInit from "../../components/numberMatched";
import deletePrevNextLinks from "../../components/deletePrevNextLinks";

async function genFeatureCollection(
  ctx: ExegesisContext,
  featuresArray: Feature[],
  count: number,
  allowed_f_values: F_AssociatedType[]
): Promise<FeatureCollection> {
  //console.log(count)
  //In order to reduce complexity in generating links (rel=(next|prev)), just remove link obj where hasNextPage|prev=false
  let links = await genLinksAll(ctx, allowed_f_values, "Items");
  const { offset, limit } = await initCommonQueryParams(ctx);

  links = await deletePrevNextLinks(ctx, links, count);

  return {
    type: "FeatureCollection",
    timeStamp: new Date().toJSON(),
    numberReturned: featuresArray.length,
    numberMatched: await numMatchedInit(ctx,count,),
    features: featuresArray,
    links: links,
  };
}

async function genConformance(
  ctx: ExegesisContext,
  conformanceClasses: string[],
  allowed_f_values: F_AssociatedType[]
) {
  return {
    conformsTo: conformanceClasses,
    links: await genLinksAll(ctx, allowed_f_values, "Conformance"),
  };
}
async function genRootDoc(
  ctx: ExegesisContext,
  allowed_f_values: F_AssociatedType[]
) {
  const doc = {
    title: "Root of the features implementation instance",
    links: await genLinksAll(ctx, allowed_f_values, "Root"),
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
  ctx: ExegesisContext,
  allowed_f_values: F_AssociatedType[],
  collectionOptions: CollectionConfig,
  mode: "root" | "specific"
): Promise<Collection> {
  let _extent_bbox = await querySpatialExtent(
    collectionOptions.modelName,
    collectionOptions.bboxgenScope
  );

  //Since the ETS does not support 6-coodinate bbox, remove the Z-axis vals
  if (_extent_bbox[0].length > 4) {
    _extent_bbox[0].splice(2, 1); //Remove Zmin
    _extent_bbox[0].splice(4, 1); //Remove Zmax
  }

  const _extent_interval = await queryTemporalIntervals(
    collectionOptions.modelName,
    collectionOptions.datetimeColumns
  );

  return {
    id: collectionOptions.collectionId,
    description: collectionOptions.description,
    title: collectionOptions.title,
    extent: {
      spatial: {
        bbox: _extent_bbox,
        crs:
          _extent_bbox[0].length === 4
            ? crsDetails.crs84Uri
            : crsDetails.crs84hUri, //crs84Uri : crs84hUri,
      },
      temporal: {
        interval: _extent_interval,
        trs: crsDetails.trs,
      },
    },
    crs:
      _extent_bbox[0].length === 4
        ? [
            crsDetails.crs84Uri,
            crsDetails.crs84hUri,
            ...crsDetails._allsupportedcrsUris.filter(
              (string) =>
                string !== crsDetails.crs84Uri &&
                string !== crsDetails.crs84hUri
            ),
          ]
        : [
            //Remove CRS84h from list of allowed CRS because it does not allow 6-element bbox queries
            crsDetails.crs84Uri,
            crsDetails.crs84hUri,
            ...crsDetails._allsupportedcrsUris.filter(
              (string) =>
                string !== crsDetails.crs84hUri &&
                string !== crsDetails.crs84Uri
            ),
          ],
    itemType: "feature",
    //Alter the ternary operator to achieve get CRS84 no matter what
    storageCrs:
      _extent_bbox[0].length > 4 ? crsDetails.crs84hUri : crsDetails.crs84hUri,
    links:
      mode === "specific"
        ? await genLinksAll(ctx, allowed_f_values, "Collection")
        : await genLinksToColl_ItemsWhenAtRoot(
            ctx,
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
  ctx: ExegesisContext,
  collections: CollectionConfig[],
  allowed_F_values: F_AssociatedType[]
): Promise<AllCollections> {
  const _allCollections: Collection[] = [];
  for (const collectionOption of collections) {
    _allCollections.push(
      await genOneCollectionDoc(ctx, allowed_F_values, collectionOption, "root")
    );
  }

  return {
    title: "All collections",
    collections: _allCollections,
    links: await genLinksAll(ctx, allowed_F_values, "collectionsRoot"),
  };
}

async function genFeature(
  ctx: ExegesisContext,
  feature: Feature,
  allowed_f_values: F_AssociatedType[]
) {
  feature.links = await genLinksAll(ctx, allowed_f_values, "Feature");
  return feature;
}
export {
  genFeature,
  genRootDoc,
  genFeatureCollection,
  genConformance,
  genOneCollectionDoc,
  genCollectionsRootDoc,
};
