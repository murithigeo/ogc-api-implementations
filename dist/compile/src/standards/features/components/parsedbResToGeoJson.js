"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @function parseDbResToGeoJson generates generates a GeoJSON feature Array from a database response
 * @externaldoc https://postgis.net/docs/manual-3.5/es/ST_AsGeoJSON.html
 * The future of this function: With the release of PostGIS v3.5, this function will cease to be used because it adds latency to the query and response
 * However future issues with the depreciaton include design of Sequelize Queries, although this is easily fixed using Sequelize column instances
 */
/**
 * @alternative to this function is such as an sql query
 * @issues To be able to get consistent results, one needs a common table expression
 * sequelize does not support them.
 * Furthermore, you can only set the @prop geojsonFeature.id using the function available on Postgis v3.5^
 * Plus, you can take advantage of autogen query features such as terniary functions and customizable interfaces
 * WITH flipped_geometries AS (
 * SELECT mountains.name, ST_FlipCoordinates(geom) AS new_geom
 * FROM mountains)
 * SELECT ST_AsGeoJSON(flipped_geometries.*, 'newgeom', 9, true) AS geojson
 * FROM flipped_geometries;
 */
async function parseDbResToGeoJson(dbResult, geomColumnName, featureIdColumnName) {
    var newFeaturesArray = [];
    /**
     * @param dbResult is less than one, then no record present thus no features
     */
    if (dbResult.rows.length < 1) {
        newFeaturesArray = [];
    }
    else {
        /**
         * if length is not less than 1, then there are features present
         */
        for (const record of dbResult.rows) {
            const { [geomColumnName]: geom, [featureIdColumnName]: id, ...otherProperties } = record;
            const { type, coordinates } = geom;
            const properties = {
                [featureIdColumnName]: id,
                ...otherProperties,
            };
            const feature = {
                type: "Feature",
                id: id,
                geometry: {
                    type,
                    coordinates,
                },
                properties,
            };
            newFeaturesArray.push(feature); //Don't know whats the reason for the error
        }
    }
    const count = dbResult.count;
    return { newFeaturesArray, count };
}
exports.default = parseDbResToGeoJson;
