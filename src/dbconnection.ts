// Initialize the sequelize function & export it to be used in specific standards

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME ?? `postgres`,
  process.env.DB_USER ?? "postgres",
  process.env.DB_PASS ?? "postgres",
  {
    host: process.env.DB_HOST??'localhost',
    port: 5432,
    ssl:true,
    dialect: "postgres",
    dialectOptions: {
      useUTC: true,
    },
    timezone: "+03:00",
    pool: {
      max: 5,
      min: 1,
      idle: 300000,
    },
  }
);

//export the sequelize function
export default sequelize;
