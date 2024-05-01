import { DataTypes, Sequelize } from "sequelize";
import { newFeatures } from "./mountains";

const _pointsModel = (sequelize: Sequelize) => {
  const model = sequelize.define(
    "mountains",
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      regions: DataTypes.ARRAY(DataTypes.STRING),
      countries: DataTypes.ARRAY(DataTypes.STRING),
      continent: DataTypes.STRING,
      height_ft: DataTypes.DECIMAL,
      height_m: DataTypes.DECIMAL,
      geom: DataTypes.GEOMETRY("PointZ", 4326),
    },
    {
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
                Sequelize.fn(
                  "ST_Xmin",
                  Sequelize.fn(
                    "ST_SetSRID",
                    Sequelize.fn("ST_Extent", Sequelize.col("geom")),
                    4326
                  )
                ),
                "xmin",
              ],
              [
                Sequelize.fn(
                  "ST_Ymin",
                  Sequelize.fn(
                    "ST_SetSRID",
                    Sequelize.fn("ST_Extent", Sequelize.col("geom")),
                    4326
                  )
                ),
                "ymin",
              ],
              [
                Sequelize.fn(
                  "ST_ZMin",
                  Sequelize.fn("ST_3DExtent", Sequelize.col("geom"))
                ),
                "zmin",
              ],
              [
                Sequelize.fn(
                  "ST_XMax",
                  Sequelize.fn(
                    "ST_SetSRID",
                    Sequelize.fn("ST_Extent", Sequelize.col("geom")),
                    4326
                  )
                ),
                "xmax",
              ],
              [
                Sequelize.fn(
                  "ST_Ymax",
                  Sequelize.fn(
                    "ST_SetSRID",
                    Sequelize.fn("ST_Extent", Sequelize.col("geom")),
                    4326
                  )
                ),
                "ymax",
              ],
              [
                Sequelize.fn(
                  "ST_ZMax",
                  Sequelize.fn("ST_3DExtent", Sequelize.col("geom"))
                ),
                "zmax",
              ],
            ],
          },
        },
      },
    }
  );

  return model;
};

export default _pointsModel;
