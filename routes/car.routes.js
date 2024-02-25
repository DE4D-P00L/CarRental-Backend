import express from "express";
import {
  getAllCars,
  getCarById,
  getFilteredCars,
} from "../controllers/car.controller.js";

const router = express.Router();

router.get("/", getAllCars);

router.post("/filter", getFilteredCars);

router.get("/:id", getCarById);

export default router;
