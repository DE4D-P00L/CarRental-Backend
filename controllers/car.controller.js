import Car from "../models/Car.js";

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

getFilteredCars;

export const getCarById = (req, res) => {};
