import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password, phone } = req.body;

  // 1. Validate required fields
  if (!username || !email || !fullname || !password || !phone) {
    throw new ApiError(400, "All fields are required.");
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists.");
  }

  const newUser = new User({
    username,
    email,
    fullname,
    password,
    phone,
  });

  await newUser.save();

  // 5. Respond (avoid sending password back)
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullname: newUser.fullname,
      phone: newUser.phone,
    },
  });
});
