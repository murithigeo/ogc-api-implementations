import { DataTypes, Sequelize } from "sequelize";

const hourlyWeather = (sequelize: Sequelize) => {
  return sequelize.define(
    "hourly2024",
    {
      //Some columns will not be used because a current lack of familiarity
      //id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, //Add this because station is repeated
      station: { type: DataTypes.STRING,primaryKey:true },
      date: {type:DataTypes.DATE,primaryKey:true}, //Is datetime column
      name: DataTypes.STRING, //Name of station
      report_type: DataTypes.STRING, //FM-12 is a SYNOP report
      wind: DataTypes.ARRAY(DataTypes.STRING), //Wind: Typical format: dddff(f)gddff(f) =>ddd(wind Direction in degrees), g (gusts), ddff(f) (gust speed)
      //cig: DataTypes.ARRAY(DataTypes.STRING), //Ceiling height: Example 22000,1,9,9 =>22000ft
      //vis: DataTypes.ARRAY(DataTypes.STRING), //Visibility: Example 030000,1,9,9 =>30000m
      temperature: DataTypes.ARRAY(DataTypes.STRING), //Temperature: Example +0280,1 (Temps in tenths of degrees)=>28.0*C
      dew: DataTypes.ARRAY(DataTypes.STRING), //Dew Point Temp: Example +0240,1 (Temps in tenths of degrees) => 24.0*C
      slp: DataTypes.ARRAY(DataTypes.STRING), //Sea Level Pressure: Example 10101, 1 (Temps in tenths of hPa) => 1010.1 hPa

      //aa1: DataTypes.ARRAY(DataTypes.STRING), //
      //ay1: DataTypes.STRING,
      //ay2: DataTypes.STRING,
      //az1: DataTypes.ARRAY(DataTypes.STRING),
      //az2: DataTypes.ARRAY(DataTypes.STRING),
      //ga1: DataTypes.ARRAY(DataTypes.STRING),
      //ga2: DataTypes.ARRAY(DataTypes.STRING),
      //ge1: DataTypes.ARRAY(DataTypes.STRING),
      //gf1: DataTypes.ARRAY(DataTypes.STRING),
      //ka1: DataTypes.ARRAY(DataTypes.STRING),
      //ma1: DataTypes.ARRAY(DataTypes.STRING),
      //md1: DataTypes.ARRAY(DataTypes.STRING),
      //mw1: DataTypes.ARRAY(DataTypes.STRING),
      //mw2: DataTypes.STRING,
      //oc1: DataTypes.STRING,
      //rem: DataTypes.STRING,
      //eqd: DataTypes.STRING,
      adm0:DataTypes.STRING(3),
      country: DataTypes.STRING,
      subregion: DataTypes.STRING,
      geom: DataTypes.GEOMETRY("POINTZ", 4326), //Long, Lat, Elevation
    },
    { timestamps: false, paranoid: false, freezeTableName: true }
  );
};
export default hourlyWeather;
