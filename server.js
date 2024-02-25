import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./DB/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import agencyUserRoutes from "./routes/agencyUser.routes.js";
import carRoutes from "./routes/car.routes.js";
import rentalRoutes from "./routes/rental.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
// TODO: add cors config
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/car", carRoutes);
app.use("/api/v1/rental", rentalRoutes);
app.use("/api/v1/agency", agencyUserRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Listening on port " + PORT);
});
