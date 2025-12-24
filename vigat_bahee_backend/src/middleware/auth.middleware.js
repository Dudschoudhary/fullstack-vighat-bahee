import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// middleware/auth.middleware.js
export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    // ✅ सिर्फ Bearer token check करो
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    console.log("🔍 Token received:", !!token); // Debug
    
    if (!token) {
      throw new ApiError(401, 'Access token required in Authorization header');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("❌ Auth error:", error.message); // Debug
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
