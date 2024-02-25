import express from "express";
import {
  login,
  signup,
  rentCar,
  showRentalHistory,
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/verifyUserJWT.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/rent", verifyJWT, rentCar);
router.get("/order-history", verifyJWT, showRentalHistory);

export default router;
