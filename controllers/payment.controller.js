import razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";

const instance = new razorpay({
  key_id: process.env.RZP_ID,
  key_secret: process.env.RZP_SECRET,
});

export const getKey = (req, res) => {
  res.status(200).json({ key: process.env.RZP_ID });
};

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  res.status(200).json({ success: true, order });
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_SECRET)
      .update(body.toString())
      .digest("hex");
    const isVerifiedSignature = expectedSignature === razorpay_signature;

    if (!isVerifiedSignature) return res.status(400).json({ success: false });
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    res.redirect(
      process.env.FRONTEND_URL + "/payment-verification/" + razorpay_payment_id
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
