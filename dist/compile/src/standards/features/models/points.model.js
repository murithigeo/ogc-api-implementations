"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _pointsModel = (sequelize) => {
    const model = sequelize.define("mountains", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        regions: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        countries: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        continent: sequelize_1.DataTypes.STRING,
        height_ft: sequelize_1.DataTypes.DECIMAL,
        height_m: sequelize_1.DataTypes.DECIMAL,
        geom: sequelize_1.DataTypes.GEOMETRY("PointZ", 4326),
    }, {
        timestamps: false,
        freezeTableName: true,
        scopes: {
            bboxgenScope: {
                attributes: {
                    //Exclude all columns since you are returning only one result.Even the geom column
                    exclude: [
                        "name",
                        "regions",
                        "countries",
                        "continent",
                        "height_ft",
                        "height_m",
                        "geom",
                    ],
                    //This assumes that we already know that our features are 3d
                    //Flag to use ST_hasZ() and set CRS84 or CRS84h first
                    include: [
                        [
                            sequelize_1.Sequelize.fn("ST_Xmin", sequelize_1.Sequelize.fn("ST_SetSRID", sequelize_1.Sequelize.fn("ST_Extent", sequelize_1.Sequelize.col("geom")), 4326)),
                            "xmin",
                        ],
                        [
                            sequelize_1.Sequelize.fn("ST_Ymin", sequelize_1.Sequelize.fn("ST_SetSRID", sequelize_1.Sequelize.fn("ST_Extent", sequelize_1.Sequelize.col("geom")), 4326)),
                            "ymin",
                        ],
                        [
                            sequelize_1.Sequelize.fn("ST_ZMin", sequelize_1.Sequelize.fn("ST_3DExtent", sequelize_1.Sequelize.col("geom"))),
                            "zmin",
                        ],
                        [
                            sequelize_1.Sequelize.fn("ST_XMax", sequelize_1.Sequelize.fn("ST_SetSRID", sequelize_1.Sequelize.fn("ST_Extent", sequelize_1.Sequelize.col("geom")), 4326)),
                            "xmax",
                        ],
                        [
                            sequelize_1.Sequelize.fn("ST_Ymax", sequelize_1.Sequelize.fn("ST_SetSRID", sequelize_1.Sequelize.fn("ST_Extent", sequelize_1.Sequelize.col("geom")), 4326)),
                            "ymax",
                        ],
                        [
                            sequelize_1.Sequelize.fn("ST_ZMax", sequelize_1.Sequelize.fn("ST_3DExtent", sequelize_1.Sequelize.col("geom"))),
                            "zmax",
                        ],
                    ],
                },
            },
        },
    });
    return model;
};
exports.default = _pointsModel;
