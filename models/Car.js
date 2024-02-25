import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgencyUser",
      required: true,
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required"],
    },
    vehicleImage: {
      type: String,
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Vehicle capacity is required"],
    },
    rent: {
      type: Number,
      required: [true, "Vehicle rent is required"],
    },
    rentStart: { type: Date, default: new Date() },
    rentEnd: { type: Date, default: new Date() },
    features: [String],
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
