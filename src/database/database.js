import sequelize from "./config.js";
import Application from "../models/applicationsModel.js";
import Crime from "../models/crimeModel.js";
import PoliceOfficer from "../models/policeofficersModel.js";
import PoliceStation from "../models/policeStationModel.js";
import CrimeType from "../models/crimeTypeModel.js";
import CrimeSubType from "../models/crimeSubTypeModel.js";
import CrimePart from "../models/crimePartModel.js";


// Define associations centrally to avoid circular imports
Application.hasMany(Crime, { foreignKey: "application_id", as: "crimes" });
Crime.belongsTo(Application, { foreignKey: "application_id", as: "application" });

PoliceOfficer.hasMany(Crime, { foreignKey: "officer_id", as: "crimes" });
Crime.belongsTo(PoliceOfficer, { foreignKey: "officer_id", as: "officer" });

PoliceStation.hasMany(Crime, { foreignKey: "station_id", as: "crimes" });
Crime.belongsTo(PoliceStation, { foreignKey: "station_id", as: "station" });

CrimeType.hasMany(CrimeSubType, { foreignKey: "crime_type_id", as: "subtypes" });
CrimeSubType.belongsTo(CrimeType, { foreignKey: "crime_type_id", as: "type" });

CrimeSubType.hasMany(Crime, { foreignKey: "crime_subtype_id", as: "crimes" });
Crime.belongsTo(CrimeSubType, { foreignKey: "crime_subtype_id", as: "subtype" });

CrimePart.hasMany(Crime, { foreignKey: "crime_part_id", as: "crimes" });
Crime.belongsTo(CrimePart, { foreignKey: "crime_part_id", as: "part" });


// Sync models
const initDb = async () => {
  try {
    // Only alter tables, don't force recreate
    await sequelize.sync({ alter: true });
    console.log("\x1b[33mAll tables and columns updated successfully!\x1b[0m");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
};

initDb();

export { Application, Crime, PoliceOfficer, PoliceStation, CrimeType, CrimeSubType, CrimePart };
export default sequelize;