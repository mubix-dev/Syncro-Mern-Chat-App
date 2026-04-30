import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import TempUser from "../models/tempUser.model.js";
import bcrypt from "bcryptjs";
import { sendEmail, emailVerificationMailgenContent } from "../config/mail.js";
import otpGenerator from "otp-generator";


export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all credentials" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    const pendingUser = await TempUser.findOne({ $or: [{ username }, { email }] });

    if (existingUser || pendingUser) {
      return res.status(400).json({
        message: "Username or email is already taken or pending verification",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const tempUser = await TempUser.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    });

    await sendEmail({
      email: tempUser.email,
      subject: "Verify your account",
      mailgenContent: emailVerificationMailgenContent(tempUser.username, otp),
    });

    return res.status(201).json({
      message: "OTP sent to email",
      email: tempUser.email,
    });
  } catch (error) {
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ message: "OTP expired or invalid. Please sign up again." });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const newUser = await User.create({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      isVerified: true,
      otp :undefined
    });

    await TempUser.deleteOne({ email });

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: `Verification error: ${error.message}` });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all credentials!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }


    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Login error occurred!" });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });
    return res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Logout error occurred!", error: error.message });
  }
};