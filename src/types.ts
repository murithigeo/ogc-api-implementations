/**
 * @interface supportedCrs defines an array of Coordinate Reference Systems that a Collection Supports
 * @example {uri: "http://www.opengis.net/def/crs/OGC/1.3/CRS84", srid: 4326, authority: "OGC", isGeographic: false  }
 */
interface SupportedCrs {
    uri: string; //An OGC URI to the CRS
    srid: number; //A n-digit code that exists in PostGIS for spatial Operations
    authority: string; //The Authority that governs the CRS defined in ./uri
    isGeographic: boolean; //Denotes whether the CRS is projected (uses x,y axis-order) or Geographic(uses y,x axis-order)
}

/**
 * @interface OGCStandards A type that enums standards that can be defined for the server
 * @type string
 */
type Standards = 'features' | 'common' | 'connectedsystems' | 'coverages' | 'dggs' | 'edr' |
    'sensorthings' | 'joins' | 'maps' | 'movingfeatures' | 'processes' | 'records' | 'routes' | 'styles' | 'tiles';
type trs = string;

//export type supportedLangs = 'en' | 'sw';
type CollectionId = string | number; //A collection can be accessed using a string/number

/**
 * @interface boundingboxQueryItems
 */

export type boundingboxQueryItems = [number,number,number, number];

/**
 * @interface boundingboxQueryItems_h
 */
/**
 * @interface FeatureStandardConfig Defines the collections available for querying on the /features endpoint
 */

interface nestedStandardOptions {
    modelName?: string;
    collectionId?: CollectionId;
    storageCrsCoordinateEpoch?: number;
    license?: {
        title?: string;
        href?: string;
    }
    supportedCrs?: SupportedCrs[]; //If none are defined, then the default will be set as CRS84
    trs?: trs;
}

export interface StandardsInterface {
    standard: Standards;
    pathToDoc: string;
    defaultOptions: {
        crs: SupportedCrs[];
        trs: trs;
    };
    collections: nestedStandardOptions[];
}
/**
 * @interface ServersArray defines the servers which can be queried as enum by the OAS spec.
 */
interface ServersArray {
    url?: string;
    description?: string;
    port?: number;
}


/**
 * @interface ServerConfig
 */

export interface ServerConfig {
    servers?: ServersArray[]; //nullish because of development mode
    standards: StandardsInterface[]
};

export interface Link {
    rel: string;
    href: string;
    type: string;
    title: string;
    hreflang?: string;
    length?: number;
}


export interface Crs_prop {
    /**
     * @type uri formed by computing `http://www.opengis.net/def/crs/{authority}/{version}/{code}
     */
    uri?: string;
    version: number;
    code: string | number;
    srid: number;
    authority: string;
    isGeographic: boolean;
}

export interface Feature {
    geometry: {
        type: string;
        coordinates: any;
    };
    id: string | number;
    type: 'Feature';
    properties?: {
        [key: string | number]: string | boolean | number;
    }
};
export interface FeatureCollection {
    type: 'FeatureCollection';
    numberMatched?: number;
    numberReturned?: number;
    timeStamp?: string;
    features: Feature[];
    links?: Link[]
};