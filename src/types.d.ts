
type CollectionId = string | number;

interface ModelsConfig {
    modelName: string;
    collectionId: CollectionId;
    license: string;
}
export interface APIConfig {
    modelsConfig: ModelsConfig[];
    port: number;
    servers:
    {
        url: string;
        description?: string;
    }[];
}