import express from "express";
import * as airport from "../controllers/aircraft.js";

const router = express.Router();

router.get("/airports", airport.getAllAirports);
router.post("/land/:airportID", airport.manageLanding);
router.get("/airport-status/:airportID", airport.checkUpdate);
export default router;
