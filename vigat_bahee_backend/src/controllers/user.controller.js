import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendTempPasswordEmail, verifyEmailConfig } from "../utils/emailService.js";
import crypto from "crypto";
import nodemailer from 'nodemailer';

const generateTempPassword = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password, phone } = req.body;

  if (!username || !email || !fullname || !password || !phone) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({ 
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] 
  });
  
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists.");
  }

  const newUser = new User({
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    fullname: fullname.trim(),
    password,
    phone: phone.trim(),
  });

  await newUser.save();

  const userResponse = {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    fullname: newUser.fullname,
    phone: newUser.phone,
    createdAt: newUser.createdAt
  };

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: userResponse,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body;

  console.log("Login attempt:", { email, remember });

  if (!email || !password) {
    throw new ApiError(400, "Email और password दोनों required हैं");
  }

  const user = await User.findOne({ 
    email: email.toLowerCase().trim() 
  });

  if (!user) {
    console.log("User not found with email:", email);
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if (!isPasswordValid) {
    console.log("Password validation failed for user:", user.email);
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  
  if (!accessToken) {
    throw new ApiError(500, "Token generation failed");
  }

  const loggedInUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    phone: user.phone,
    createdAt: user.createdAt
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  };

  const isTemporaryPassword = user.isTemporaryPassword || false;

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
      success: true,
      message: "User logged in successfully",
      token: accessToken,
      user: loggedInUser,
      isTemporaryPassword: isTemporaryPassword
    });
});

import bcrypt from 'bcryptjs';

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).send(`
        <h2>Error</h2>
        <p>Passwords do not match.</p>
        <a href="/reset-password/${token}">Try Again</a>
      `);
    }
    
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).send(`
        <h2>Error</h2>
        <p>Password reset token is invalid or has expired.</p>
        <a href="/forgot-password">Request New Reset Link</a>
      `);
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.send(`
      <h2>Success!</h2>
      <p>Your password has been reset successfully.</p>
      <a href="/login">Login Now</a>
    `);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`
      <h2>Error</h2>
      <p>Something went wrong. Please try again.</p>
      <a href="/forgot-password">Try Again</a>
    `);
  }
};

// // Configure email transporter (Gmail example)
// const transporter = nodemailer.createTransporter({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // your email
//     pass: process.env.EMAIL_PASS  // your app password
//   }
// });

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send(`
        <h2>Error</h2>
        <p>No account found with that email address.</p>
        <a href="/forgot-password">Try Again</a>
      `);
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save token and expiry time (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Create reset URL
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetURL}" style="background: blue; color: white; padding: 10px; text-decoration: none;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.send(`
      <h2>Email Sent!</h2>
      <p>Password reset link has been sent to ${email}</p>
      <p>Please check your email and click the reset link.</p>
      <a href="/login">Back to Login</a>
    `);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`
      <h2>Error</h2>
      <p>Something went wrong. Please try again.</p>
      <a href="/forgot-password">Try Again</a>
    `);
  }
};


export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  console.log("Change password request for user:", req.user?._id);

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized - please login first");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCurrentPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isCurrentPasswordValid) {
    console.log("Current password verification failed");
    throw new ApiError(401, "Current password is incorrect");
  }

  console.log("Current password verified");

  user.password = newPassword;
  user.isTemporaryPassword = false;
  await user.save();

  console.log("Password changed successfully");

  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("accessToken")
    .json({
      success: true,
      message: "User logged out successfully"
    });
});

export const debugUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({}, 'email username fullname createdAt').sort({ createdAt: -1 });
    
    console.log("📋 All users in database:");
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} | ${user.username} | ${user.fullname}`);
    });
    
    res.status(200).json({
      success: true,
      message: "Debug information retrieved",
      totalUsers: allUsers.length,
      users: allUsers.map(user => ({
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    throw new ApiError(500, "Debug failed");
  }
});

export const testEmail = asyncHandler(async (req, res) => {
  try {
    const isConfigValid = await verifyEmailConfig();
    
    if (isConfigValid) {
      res.status(200).json({
        success: true,
        message: "Email configuration is working properly"
      });
    } else {
      throw new ApiError(500, "Email configuration failed");
    }
  } catch (error) {
    console.error("Email test failed:", error);
    throw new ApiError(500, "Email configuration test failed");
  }
});
