"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*

import { DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcrypt";
const userModel = (sequelize: Sequelize) => {
  const model = sequelize.define(
    "users",
    {
      apiKey: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4(),
        allowNull: false,
      },
      password: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      saltValue: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      hooks: {
        beforeCreate: async (instance) => {
          //console.log(instance.getDataValue("saltValue"));
          instance.set(
            "password",
            await bcrypt.hash(
              instance.getDataValue("password"),
              instance.getDataValue("saltValue")
            )
          );
        },
      },
    }
  );
  return model;
};

export default userModel;


*/ 
