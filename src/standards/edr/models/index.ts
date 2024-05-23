import fs from "fs";
import sequelize from "../../../dbconnection";

//import models
import SrsModel from "./srs";
import path from "path";
import edrModelScopes from "./scripts/models.scopes";

//Init models
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") && file !== "index.ts" && file.slice(-3) === ".ts";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(sequelize);
    sequelize.models[model.name] = model;
    
    
    /*
    if(model.name==="hourly2024"){
      model.sync({force:true})
    }
    */
  });

//Initialize the scopes

(async () => {
  await edrModelScopes(sequelize);
})();


export default sequelize;
