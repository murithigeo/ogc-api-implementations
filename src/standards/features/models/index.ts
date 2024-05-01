import sequelize from "../../../dbconnection";
import { newFeatures } from "./mountains";

//import models models
import _pointsModel from "./points.model";
//const _mountainsModel = _pointsModel(sequelize);
sequelize.models.mountains = _pointsModel(sequelize);
//Define scopes here

//init & export the models

//_mountainsModel.sync({});

/*.then(() => {
    for (const feature of newFeatures) {
      _mountainsModel.findOrCreate({
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
  });

  */
export default sequelize;
