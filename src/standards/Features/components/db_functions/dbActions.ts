import { Link, RawGeoDataResult, boundingboxQueryItems } from '../../../../types';
import turfjs from '@turf/turf';
import { hficData } from '../datastore';
//console.log(data)
import sequelize from "../../../../dbconnection";
import { DataTypes, INTEGER, Op, Sequelize } from "sequelize";
import { ExegesisContext } from 'exegesis-express';
import coreServerQueryParams from '../params';




//Define the database model for the data
export const HFICModel = (sequelize: Sequelize) => {
    const model = sequelize.define('hfic', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        classification_scale: DataTypes.STRING,
        country_code: DataTypes.STRING,
        datasourcedocument: DataTypes.INTEGER,
        datasourceorganization: DataTypes.INTEGER,
        is_allowing_for_assistance: DataTypes.BOOLEAN,
        projection_end: DataTypes.STRING,
        projection_start: DataTypes.STRING,
        reporting_date: DataTypes.STRING,
        scenario: DataTypes.STRING,
        unit_type: DataTypes.STRING,
        value: DataTypes.INTEGER,
        geom: DataTypes.GEOMETRY // The database includes MultiPolygons, MultiPoints etc
    }, {
        timestamps: false,
        freezeTableName: true,
        scopes: {
            bboxGenerationScope: {
                attributes: {
                    //include
                    exclude: [
                        'id', `classification_scale`, 'country_code', 'datasourcedocument',
                        'datasourcedocument', 'is_allowing_for_assistance', 'projection_end',
                        'projection_start', 'reporting_date', 'scenario', 'unit_type', 'value',
                        'geom' //Also excluded since we only want to return the bbox not the geometry
                    ],
                    //This strategy uses ST_SetSRID(ST_Extent)  thus returning a Polygon which is then parsed to an Object by Sequelize
                    //Will try to use simple functions such as ST_MinY...
                    include: [
                        [Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_Extent', Sequelize.col('"hfic"."geom"')), "4326"), 'bbox']
                    ]
                }
            }
        }
    });

    /**
     * Check if [hfic] table exists in the database.
     * If it does not, sync the database
     */
    (async () => {

        await model.sync().then(dbResult => {
            if (dbResult) {
                console.log(`sequelize has detected the requisite table does not exist in db.\n Creating table in DB`);
            }
        });

        for (const instance of hficData.features) {
            instance.geometry.crs = { type: 'name', properties: { name: 'EPSG:4326' } }
            model.findOne({
                where: {
                    id:
                        instance.id
                }
            }).then(dbResult => {
                if (!dbResult) { //If dbResponse is non-truthy (null, error, undefined) indicating no records, create them
                    model.create({
                        id: instance.id,
                        classification_scale: instance.properties.classification_scale,
                        country_code: instance.properties.country_code,
                        datasourcedocument: instance.properties.datasourcedocument,
                        datasourceorganization: instance.properties.datasourceorganization,
                        is_allowing_for_assistance: instance.properties.is_allowing_for_assistance,
                        projection_end: instance.properties.projection_end,
                        projection_start: instance.properties.projection_start,
                        scenario: instance.properties.scenario,
                        unit_type: instance.properties.unit_type,
                        value: instance.properties.value,
                        geom: instance.geometry
                    });
                }
            });
        };
    })();
    return model;
};

export async function retrieveItems(context: ExegesisContext, featureIdColumnName?: string) {
    const dbInterface = HFICModel(sequelize);
    const { limit, offset, bbox, flipCoords, validated_bboxcrs, validated_crs } = await coreServerQueryParams(context);
    //let dbResult: RawGeoDataResult[];
    /**
 * @notes : Most of the statements used are ternary conditions
 * @example if [datetime] queryParam is not truthy, don't pass the request to sequelize (undefined)
 * @example if it's truthy, run the query after ?
 */
    const bboxQuery = validated_bboxcrs.length < 1 ? undefined : context.params.query['bbox-crs'] ? { bbox: Sequelize.fn('ST_Intersects', Sequelize.col('"hfic"."geom"'), Sequelize.fn('ST_Transform', Sequelize.fn(`ST_MakeEnvelope(${validated_bboxcrs[0].srid}`), '4326')) } : undefined;

    const featureIdQuery = context.params.path.featureId ? { [featureIdColumnName]: context.params.path.featureId } : undefined;
    /**
     * @param count is the number of features that matched the user query
     * @param rows is the actual data returned from the db
     * While @findAll would be better, the count is useful for pagination and formulating an interface to get count separately increases latency?
     */
    const { count, rows } = await dbInterface.findAndCountAll({
        where: {

            //Make sure the records that are queried/returned have a geometry
            geom: { [Op.ne]: null },

            /**
             * @param Op.and : Used instead of @param Op.or because multiple query params limit the features () expected to be returned
             * Part3 defines CQL. Behaviour may change @19_04_2024
             */
            [Op.and]: [
                bboxQuery,
                featureIdQuery
                //Other queries here
            ]
        },
        /**
         * Remove 
         */
        raw: true,
        /**
         * @param order Sort the records before returning. Enables consistent paging
         */
        order: [['id', 'ASC']],
        /**
         * @param includeIgnoreAttributes Ignore artifacts generated by Sequelize especially when working with joins
         * Since this option is not documented in SequelizeTypes, use // @ts-expect-error
         */
        // @ts-expect-error
        includeIgnoreAttributes: false,

        /**
         * @param limit Define the maximum number of items that should be returned from db
         * Due to filtering, results(rows).length maybe <limit
         */
        limit: limit,

        /**
         * @param offset Define how many records should be skipped. Simulates pagination
         */
    });
    return { count, rows };
}