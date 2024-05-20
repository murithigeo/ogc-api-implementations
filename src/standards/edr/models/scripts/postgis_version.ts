import { QueryTypes, Sequelize } from "sequelize";

const getPostGisVersion = async (sequelize: Sequelize) =>
  (
    (await sequelize.query(`SELECT POSTGIS_LIB_VERSION() as postgis_version`, {
      type: QueryTypes.SELECT,
    })) as any
  )[0].postgis_version;

export default getPostGisVersion;
