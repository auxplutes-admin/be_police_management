import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./database/database.js";
import sequelize from "./database/config.js";
import crimeRoutes from "./routes/crimeRoutes.js";
import policeOfficerRoutes from "./routes/policeOfficerRoutes.js";
import policeStationRoutes from "./routes/policeStationRoutes.js";


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

  // Log all requests
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url} - Status: ${res.statusCode}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  next();
});

// Routes

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/crimes", crimeRoutes);
app.use("/api/v1/police-officers", policeOfficerRoutes);
app.use("/api/v1/police-stations", policeStationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Database connected:", sequelize.authenticate());
});

export default app;