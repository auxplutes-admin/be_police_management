import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST,
  dialect: "postgres",
  logging: false,
  dialectOptions:
    process.env.POSTGRES_SSL === "true"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log("\x1b[32mDatabase connected successfully:", process.env.POSTGRES_DB, "\x1b[0m");
    } catch (err) {
      console.error("\x1b[31mDatabase connection error:", err.message, "\x1b[0m");
    }
};
  
connectDB();

export default sequelize;