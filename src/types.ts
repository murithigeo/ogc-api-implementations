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
type Standards = 'Features' | 'Common' | 'ConnectedSystems' | 'Coverages' | 'DGGS' | 'EDR' |
    'SensorThings' | 'Joins' | 'Maps' | 'MovingFeatures' | 'Processes' | 'Records' | 'Routes' | 'Styles' | 'Tiles';
type trs = string;

//export type supportedLangs = 'en' | 'sw';
type CollectionId = string | number; //A collection can be accessed using a string/number


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

