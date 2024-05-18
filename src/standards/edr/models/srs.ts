import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../../dbconnection";

const SrsModel = (sequelize: Sequelize) => {
  const model = sequelize.define("spatial_ref_sys", {
    srid: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    auth_name: {
      type: DataTypes.STRING,
    },
    auth_srid: DataTypes.INTEGER,
    srtext: DataTypes.STRING(2048),
    proj4text: DataTypes.STRING(2048),
  },{
    timestamps: false,
    paranoid: true,
    freezeTableName: true
  });
  model.sync({ alter: false, force: false });
  return model;
};

export default SrsModel;
