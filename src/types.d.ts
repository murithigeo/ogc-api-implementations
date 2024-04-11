
//OpenAPI Object
/**
 * @author exegesis
 */
type CollectionId = string | number;

interface ModelsConfig {
    modelName: string;
    collectionId: CollectionId;
    license?: string;
}

/**
 * @prop Features @alias Features @external https://ogcapi.ogc.org/features
 * @prop Common @alias Common @external https://ogcapi.ogc.org/common
 * @prop Connected Systems @alias ConnectedSystems @external https://ogcapi.ogc.org/connectedsystems
 * 
 */
type OgcStandard = 'Template' | 'Features' | 'Common' | 'ConnectedSystems' | 'Coverages' | 'DGGS' | 'EDR' |
    'SensorThings' | 'Joins' | 'Maps' | 'MovingFeatures' | 'Processes' | 'Records' | 'Routes' | 'Styles' | 'Tiles';

/**
 * @o
 */

export interface APIConfig {
    modelsConfig: ModelsConfig[];
    port: number;
    servers:
    {
        url: string;
        description?: string;
    }[];
    activeStandards: {
        /**
         * @param pathToDoc - Relative to the ./src dir
         */
        pathToDoc: string;
        standard: OgcStandard
    }[]
}