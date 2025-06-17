/* eslint-disable no-undef */
import mongoose from "mongoose";
const dbConnect = async () => {
  // Simple DB Connection
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default dbConnect;
