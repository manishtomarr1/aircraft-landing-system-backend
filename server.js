// server.js
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import { dbConnection } from "./helpers/dbConnection.js";
import Airport from "./modals/airport.js"
import aircraftRoutes from "./routes/aircraft.js";


const app = express();

mongoose.set("strictQuery", false);

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(cors());
app.use("/api", aircraftRoutes);

const port = process.env.PORT || 9000;

const seedAirports = async () => {
  try {
    // Check if there are no airports in the database
    const airportsCount = await Airport.countDocuments();

    if (airportsCount === 0) {
      const initialAirports = [
        { airportName: "Airport LGW", airportID: "LGW" },
        { airportName: "Airport EMA", airportID: "EMA" },
        { airportName: "Airport MAN", airportID: "MAN" },
      ];

      // Insert the airports into the database
      await Airport.insertMany(initialAirports);

      console.log("Initial 3 airports added successfully");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error.message);
  }
};

dbConnection().then(() => {
  seedAirports(); 


  app.get("/", (req, res) => {
    res.json({
      data: "node.js welcome you! you are now connected with me, let's build aircraft landing management together ",
    });
  });

  app.listen(port, () => {
    console.log(`Your app is running on port ${port}`);
  });
});
