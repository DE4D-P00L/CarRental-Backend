import express from "express";
import verifyAgency from "../middlewares/verifyAgencyJWT.js";
import {
  addCar,
  login,
  signup,
  allCars,
  showRentalOrders,
} from "../controllers/agencyUser.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/add-car", verifyAgency, upload.single("carImage"), addCar);
// TODO: add delete and update car actions
router.get("/all-cars", verifyAgency, allCars);
router.get("/orders", verifyAgency, showRentalOrders);

export default router;
