"use strict";
// Initialize the sequelize function & export it to be used in specific standards
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres', {
    dialect: 'postgres',
    dialectOptions: {
        useUTC: true,
    },
    timezone: '+03:00',
    pool: {
        max: 5,
        min: 1,
        idle: 300000,
    }
});
//export the sequelize function
exports.default = sequelize;
