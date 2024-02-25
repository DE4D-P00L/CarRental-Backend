import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const agencyUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      minLength: 10,
      maxLength: 10,
    },
    address: {
      type: String,
      required: true,
    },
    cars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        default: [],
      },
    ],
    rentOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rental",
        default: [],
      },
    ],
    verifiedAgency: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

agencyUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

agencyUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5d",
    }
  );
};

agencyUserSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const AgencyUser = mongoose.model("AgencyUser", agencyUserSchema);
export default AgencyUser;
