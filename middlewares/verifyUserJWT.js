import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers["Authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - Token not provided", success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ error: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded._id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifyJWT ", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export default verifyJWT;
