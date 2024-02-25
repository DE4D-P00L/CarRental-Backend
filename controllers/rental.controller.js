import mongoose from "mongoose";
import Rental from "../models/Rental.js";

export const rentCar = async (req, res) => {
  const { user } = req;
  const { agencyId, carId, startDate, endDate, price } = req.body;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const rent = new Rental({
      customerId: user._id,
      agencyId,
      carId,
      startDate,
      endDate,
      price,
    });

    await rent.save({ session });

    await session.commitTransaction();
  } catch (error) {
    console.log("Error in login Controller", error.message);
    await session.abortTransaction();
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
