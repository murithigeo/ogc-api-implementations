import parseOasDoc from "../../components/parseOasDoc";
import { globalexegesisOptions } from "../../server";
import {
  edrGetServiceDesc,
  edrGetServiceDoc,
} from "./controllers/edrApiController";
import { edrQueryAreaAtCollection } from "./controllers/edrAreaEndpointController";
import {
  edrGetCollectionsRoot,
  edrGetOneCollection,
} from "./controllers/edrCollectionsController";
import edrGetConformance from "./controllers/edrConformanceController";
import {
  edrQueryCubeAtCollection,
  edrQueryCubeAtInstance,
} from "./controllers/edrCubeEndpointController";
import {
  edrGetAllInstancesInCollection,
  edrGetOneInstanceInCollection,
} from "./controllers/edrInstancesEndpointController";
import {
  edrGetAllItemsInCollection,
  edrGetAllItemsInInstance,
  edrGetOneItemInCollection,
  edrGetOneItemInInstance,
} from "./controllers/edrItemsEndpointController";
import {
  edrQueryLocationsAtCollection_One,
  edrQueryLocationsAtCollection_All,
  edrQueryLocationsAtInstance_All,
  edrQueryLocationsAtInstance_One,
} from "./controllers/edrLocationsEndpointController";
import {
  edrQueryPositionAtCollection,
  edrQueryPositionAtInstance,
} from "./controllers/edrPositionEndpointController";
import {
  edrQueryRadiusAtCollection,
  edrQueryRadiusAtInstance,
} from "./controllers/edrRadiusEndpointController";
import edrGetRoot from "./controllers/edrRootController";
import * as exegesisExpress from "exegesis-express";
import {
  edrQueryTrajectoryAtCollection,
  edrQueryTrajectoryAtInstance,
} from "./controllers/edrTrajectoryEndpointController";
import {
  edrQueryCorridorAtCollection,
  edrQueryCorridorAtInstance,
} from "./controllers/edrCorridorEndpointController";
export const edrDocument = parseOasDoc("./src/standards/edr/index.yaml", "edr");

export default async function edrExegesisInstance() {
  globalexegesisOptions.controllers = {
    /**
     * @path {root}/
     */
    edrRootController: {
      edrGetRoot,
    },

    /**
     * @path {root}/conformance
     */
    edrConformanceController: {
      edrGetConformance,
    },

    edrApiController: {
      /**
       * @function edrGetServiceDesc
       * @path {root}/api
       */
      edrGetServiceDesc,
      /**
       * @function edrGetServiceDoc
       * @path {root}/api.html
       */
      edrGetServiceDoc,
    },

    /**
     * @description Handles roots for {root}/collections & {root}/collections/{collectionId}
     * @controller edrCollectionsController
     *
     */
    edrCollectionsController: {
      /**
       * @function edrGetCollectionsRoot
       * @returns [All] Collections
       */
      edrGetCollectionsRoot,

      /**
       * @function edrGetOneCollection
       * @returns [One] Collection
       * @path {root}/collections/{collectionId}
       */
      edrGetOneCollection,
    },

    /**
     * @controller edrInstancesController
     * @description  Groups requests to @paths {root}/collections/{collectionId}/instances & {root}/collections/{collectionId}/instances/{instanceId}
     */
    edrInstancesEndpointController: {
      /**
       * @function edrGetAllInstancesInCollection
       * @path {root}/collections/{collectionId}/instances
       * @returns [All] Instances
       */
      edrGetAllInstancesInCollection,

      /**
       * @function edrGetOneInstanceInCollection
       * @returns [One] Instance
       */
      edrGetOneInstanceInCollection,
    },

    /**
     * @controller edrItemsEndpointController
     * @description Groups Requests to @paths ending with /items. This is not automatic: Operation must be included in this controller
     */
    edrItemsEndpointController: {
      /**
       * @function getItemsInCollection_NoInstance
       * @path {root}/collections/{collectionId}/items
       * @returns edrGeoJSON FeatureCollection
       */
      edrGetAllItemsInCollection,

      /**
       * @function getOneItemInCollection_NoInstance
       * @path {root}/collections/{collectionId}/items/{itemId}
       * @returns edrGeoJSON Feature
       */
      edrGetOneItemInCollection,

      /**
       * @function getAllItemsInInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/items
       * @returns edrGeoJSON FeatureCollection
       */
      edrGetAllItemsInInstance,

      /**
       * @function getOneItemInInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/items/{itemId}
       * @returns edrGeoJSON FeatureCollection
       */
      edrGetOneItemInInstance,
    },

    /**
     * @controller edrPositionEndpointController
     * @paths endingWith /position
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrPositionEndpointController: {
      /**
       * @function edrQueryPositionAtCollection
       * @path {root}/collections/{collectionId}/position
       */
      edrQueryPositionAtCollection,

      /**
       * @function edrQueryPositionAtInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/position
       * */
      edrQueryPositionAtInstance,
    },
    /**
     * @controller edrRadiusEndpointController
     * @paths endingWith /radius
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrRadiusEndpointController: {
      /**
       * @function edrQueryPositionAtCollection
       * @path {root}/collections/{collectionId}/radius
       */
      edrQueryRadiusAtCollection,

      /**
       * @function edrQueryPositionAtInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/radius
       * */
      edrQueryRadiusAtInstance,
    },

    /**
     * @controller edrRadiusEndpointController
     * @paths endingWith /area
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrAreaEndpointController: {
      /**
       * @function edrQueryPositionAtCollection
       * @path {root}/collections/{collectionId}/area
       */
      edrQueryAreaAtCollection,

      /**
       * @function edrQueryPositionAtInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/area
       * */
      edrQueryRadiusAtInstance,
    },
    /**
     * @controller edrLocationsEndpointController
     * @paths endingWith /locations
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrLocationsEndpointController: {
      /**
       * @function edrQueryLocationsAtCollection_All
       * @path {root}/collections/{collectionId}/locations
       */
      edrQueryLocationsAtCollection_All,

      /**
       * @function edrQueryLocationsAtInstance_All
       * @path {root}/collections/{collectionId}/instances/{instanceId}/locations
       * */
      edrQueryLocationsAtInstance_All,

      /**
       * @function edrQueryLocationsAtCollection_One
       * @path {root}/collections/{collectionId}/locations/{locationId}
       */
      edrQueryLocationsAtCollection_One,

      /**
       * @function edrQueryLocationsAtInstance_One
       * @path {root}/collections/{collectionId}/instances/{instanceId}/locations/{locationId}
       * */
      edrQueryLocationsAtInstance_One,
    },
    /**
     * @controller edrCubeEndpointController
     * @paths endingWith /cube
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrCubeEndpointController: {
      /**
       * @function edrQueryCubeAtCollection
       * @path {root}/collections/{collectionId}/cube
       */
      edrQueryCubeAtCollection,

      /**
       * @function edrQueryCubeAtInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/cube
       * */
      edrQueryCubeAtInstance,
    },

    /**
     * @controller edrTrajectoryEndpointController
     * @paths endingWith /cube
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrTrajectoryEndpointController: {
      /**
       * @function edrQueryTrajectoryAtCollection
       * @path {root}/collections/{collectionId}/trajectory
       */
      edrQueryTrajectoryAtCollection,

      /**
       * @function edrQueryTrajectoryAtInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/trajectory
       * */
      edrQueryTrajectoryAtInstance,
    },
    /**
     * @controller edrTrajectoryEndpointController
     * @paths endingWith /cube
     * @return edrGeoJSON FeatureCollection | yaml | coverageJSON
     */
    edrCorridorEndpointController: {
      /**
       * @function edrQueryTrajectoryAtCollection
       * @path {root}/collections/{collectionId}/corridor
       */
      edrQueryCorridorAtCollection,

      /**
       * @function edrQueryTrajectoryAtInstance
       * @path {root}/collections/{collectionId}/instances/{instanceId}/corridor
       * */
      edrQueryCorridorAtInstance,
    },
  };
  return await exegesisExpress.middleware(
    await edrDocument,
    globalexegesisOptions
  );
}
