import { Sequelize } from "sequelize";
import sequelize from "./models";

(async () => {
  const dbres = await sequelize.models.hourly2024.findAll({
    raw: true,
    where: {
      station: "67085099999",
    },

    group: ["geom"],
    limit: 1,
    attributes: [
      "geom",
      [Sequelize.fn("Array_agg",Sequelize.col("date")),"datetime"],
      [Sequelize.fn("Array_agg", Sequelize.col("wind")), "wind"],
    ],
  });
  console.log(JSON.stringify(dbres));
  process.exit(0);
})();
