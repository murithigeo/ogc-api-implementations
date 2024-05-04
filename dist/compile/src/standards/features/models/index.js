"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnection_1 = __importDefault(require("../../../dbconnection"));
//import { newFeatures } from "./mountains";
//import models models
const points_model_1 = __importDefault(require("./points.model"));
//const _mountainsModel = _pointsModel(sequelize);
dbconnection_1.default.models.mountains = (0, points_model_1.default)(dbconnection_1.default);
//Define scopes here
//init & export the models
//_mountainsModel.sync({});
/*.then(() => {*/
/*
(async()=>{
  for (const feature of newFeatures) {
    await sequelize.models.mountains.findOrCreate({
      where: {
        name: feature.id,
      },
      raw: true,
      defaults: {
        name: feature.id,
        geom: feature.geometry,
        regions: feature.properties.regions,
        countries: feature.properties.countries,
        height_ft: feature.properties.height_ft,
        height_m: feature.properties.height_m,
      },
    });
  }
})()
    
*/
/*
  });

  */
const featuresSeqInstance = dbconnection_1.default;
exports.default = featuresSeqInstance;
