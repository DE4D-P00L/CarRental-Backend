import User from "../models/User.js";
import AgencyUser from "../models/AgencyUser.js";
import Rental from "../models/Rental.js";
import Car from "../models/Car.js";
import isValidEmail from "../utils/verifyEmail.js";
import mongoose from "mongoose";
import { response } from "express";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validEmail = isValidEmail(email);
    if (!validEmail)
      return res
        .status(400)
        .json({ message: "Enter valid email", success: false });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ message: "Wrong Password", success: false });

    const token = await user.generateAccessToken();
    const { _id, firstName, lastName, phone, address, rentHistory } = user;
    const userResponse = {
      _id,
      firstName,
      lastName,
      email,
      phone,
      address,
      rentHistory,
    };

    res.status(201).json({
      user: userResponse,
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log("Error in login Controller", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      rentHistory,
    } = req.body;

    const validEmail = isValidEmail(email);
    if (!validEmail)
      return res
        .status(400)
        .json({ message: "Enter valid email", success: false });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username already exists", success: false });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      rentHistory,
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid user Data", success: false });

    const token = await user.generateAccessToken();

    const userResponse = {
      _id: user._id,
      firstName,
      lastName,
      email,
      phone,
      address,
      rentHistory,
    };

    res.status(201).json({
      user: userResponse,
      message: "Signed up successfully",
      success: true,
      token,
    });
  } catch (error) {
    console.log("Error in signup Controller", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const showRentalHistory = async (req, res) => {
  const { _id } = req.user;
  try {
    const rentals = await Rental.find({ customerId: _id })
      .populate("carId")
      .populate({ path: "customerId", select: "-password" });
    res.status(201).json({ message: "Rented History", success: true, rentals });
  } catch (error) {
    console.log("Error in showRentalHistory Controller", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const rentCar = async (req, res) => {
  const { user } = req;
  const { carId, agencyId, startDate, endDate, price } = req.body;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const rental = new Rental({
      customerId: user._id,
      carId,
      agencyId,
      startDate,
      endDate,
      price,
    });

    const car = await Car.findById(carId);
    car.rentStart = startDate;
    car.rentEnd = endDate;

    await car.save({ session });

    await rental.save({ session });
    user.rentHistory.push(rental._id);
    await user.save({ session });

    const agency = await AgencyUser.findById(agencyId);
    agency?.rentOrders.push(rental._id);
    await agency.save({ session });

    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Rented successfully", success: true, rental });
  } catch (error) {
    console.log("Error in rentCar Controller", error);
    await session.abortTransaction();
    res.status(500).json({ message: "Internal Server Error", success: false });
  } finally {
    session.endSession();
  }
};
