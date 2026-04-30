import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Deletes after 5 mins
});

const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;
