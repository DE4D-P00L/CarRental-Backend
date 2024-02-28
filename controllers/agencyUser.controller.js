import AgencyUser from "../models/AgencyUser.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Rental from "../models/Rental.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import isValidEmail from "../utils/verifyEmail.js";
import mongoose from "mongoose";

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const validEmail = isValidEmail(email);
//     if (!validEmail)
//       return res
//         .status(400)
//         .json({ message: "Enter valid email", success: false });
//     const user = await AgencyUser.findOne({ email });
//     if (!user)
//       return res
//         .status(400)
//         .json({ message: "User not found", success: false });
//     const isPasswordCorrect = await user.verifyPassword(password);
//     if (!isPasswordCorrect)
//       return res
//         .status(400)
//         .json({ message: "Wrong Password", success: false });

//     const token = await user.generateAccessToken();
//     const { _id, firstName, lastName, phone, address, rentHistory } = user;
//     const userResponse = {
//       _id,
//       firstName,
//       lastName,
//       email,
//       phone,
//       address,
//       rentHistory,
//       isAgency: true,
//     };

//     res.status(201).json({
//       user: userResponse,
//       success: true,
//       message: "Login successful",
//       token,
//     });
//   } catch (error) {
//     console.log("Error in login Controller", error.message);
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//       error: error.message,
//     });
//   }
// };

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    const validEmail = isValidEmail(email);
    if (!validEmail)
      return res
        .status(400)
        .json({ message: "Enter valid email", success: false });

    const existingUser =
      (await AgencyUser.findOne({ email })) || (await User.findOne({ email }));

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    const user = await AgencyUser.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
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
      isAgency: true,
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

export const addCar = async (req, res) => {
  const { model, vehicleNumber, capacity, rent, features } = req.body;
  const featuresArray = features.split(",");
  const { user } = req;
  const carImgLocalPath = req.file?.path;
  const session = await mongoose.startSession();
  try {
    const vehicleImageObjectURL = await uploadOnCloudinary(carImgLocalPath);
    session.startTransaction();
    const car = new Car({
      agencyId: req.user._id,
      model,
      vehicleNumber,
      capacity,
      rent,
      features: featuresArray || "",
      vehicleImage: vehicleImageObjectURL || "",
    });
    await car.save({ session });
    user.cars.push(car._id);
    await user.save({ session });

    await session.commitTransaction();
    res
      .status(201)
      .json({ message: "Car successfully added", success: true, car });
  } catch (error) {
    console.log("Error in addCar Controller", error.message);
    await session.abortTransaction();
    res.status(500).json({ message: "Internal Server Error", success: false });
  } finally {
    session.endSession();
  }
};

export const allCars = async (req, res) => {
  const { _id } = req.user;
  try {
    const cars = await Car.find({ agencyId: _id });
    res.status(201).json({ message: "All Cars", success: true, cars });
  } catch (error) {
    console.log("Error in allCars Controller", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const showRentalOrders = async (req, res) => {
  const { _id } = req.user;
  try {
    const rentals = await Rental.find({ agencyId: _id })
      .populate("carId")
      .populate({ path: "customerId", select: "-password" });
    res.status(201).json({ message: "Rented cars", success: true, rentals });
  } catch (error) {
    console.log("Error in showRentalOrders Controller", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
