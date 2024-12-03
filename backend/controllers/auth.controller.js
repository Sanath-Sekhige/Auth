//backend/controllers/auth.controller.js

import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";  // For JWT authentication
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js"; 

// Signup Function (as provided in your example)
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiration

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt,
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken); 

    // Generate token and set it as a cookie
    generateTokenAndSetCookie(res, user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email to activate your account.",
      user: {
        ...user._doc,
        password: undefined, // Hide the password field
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Email Verification Function (as provided in your example)
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name); 

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined, // Hide the password field
      },
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Please verify your email before logging in." });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600000 }); // 1 hour expiration

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user._doc,
        password: undefined, // Hide the password field
      },
      token, // Include the JWT token in the response (if needed)
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Logout Function
export const logout = (_, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 3600000; // 1 hour validity

    // Save the reset token and expiry date to the user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // Send password reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const resetPassword = async (req, res) => {
  console.log('Request Body:', req.body);
  
  const { token } = req.params; // The reset token from the URL
  const { password } = req.body; // The new password
  
  console.log('Received token:', token);
  console.log('Received password:', password);

  // Ensure the password is provided
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required.",
    });
  }

  try {
    // Find the user based on the reset token and check its expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // Optionally, send a confirmation email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};


export const checkAuth = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;  // Replace 'token' with your actual cookie name

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, no token found" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the userId from the decoded token to find the user
    const user = await User.findById(decoded.id).select("-password");  // Exclude password field

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // If the user is found, send the user data as the response
    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log("Error in checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
