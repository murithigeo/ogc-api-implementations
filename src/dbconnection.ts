// Initialize the sequelize function & export it to be used in specific standards

import { Sequelize } from "sequelize";
import pg from 'pg';
const sequelize = new Sequelize(
  process.env.DB_NAME ?? `postgres`,
  process.env.DB_USER ?? "postgres",
  process.env.DB_PASS ?? "postgres",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: 5432,
    //ssl: true,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      useUTC: true,
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
            }
          :false,
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
