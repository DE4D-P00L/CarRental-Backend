import express from "express";
import {
  checkout,
  getKey,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/getKey", getKey);

router.post("/checkout", checkout);

router.post("/verify-payment", verifyPayment);

export default router;
