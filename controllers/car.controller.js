import Car from "../models/Car.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.status(200).json({
      message: "All cars",
      success: true,
      cars,
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

export const getFilteredCars = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const cars = await Car.find({
      $or: [{ rentEnd: { $lte: startDate } }, { rentStart: { $gt: endDate } }],
    });
    res.status(200).json({
      message: "All cars",
      success: true,
      cars,
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

export const getCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    res.status(200).json({
      message: "Car Found!",
      success: true,
      car,
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

export const editCar = async (req, res) => {
  const { id } = req.params;
  const { model, vehicleNumber, capacity, rent, features } = req.body;
  const featuresArray = features.split(",");
  const carImgLocalPath = req.file?.path;
  try {
    const vehicleImageObjectURL = await uploadOnCloudinary(carImgLocalPath);

    const updateData = {
      model,
      vehicleNumber,
      capacity,
      rent,
      features: featuresArray,
    };

    if (carImgLocalPath) {
      updateData["vehicleImage"] = vehicleImageObjectURL;
    }

    const car = await Car.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({
      message: "Car Updated!",
      success: true,
      car,
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
