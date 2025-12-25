import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10,15}$/,
    }
    ,
    resetPasswordToken: {
      type: String,
      default: undefined
    },
    resetPasswordExpiry: {
      type: Date,
      default: undefined
    },
    isTemporaryPassword: {
      type: Boolean,
      default: false,
    },
    baheeDetails_ids: [{
      type: Schema.Types.ObjectId,
      ref: "BaheeDetails"
    }],
    PersonalbaheeModal_ids: [{
      type: Schema.Types.ObjectId,
      ref: "PersonalbaheeModal"
    }]
  },
  {
    timestamps: true,
  }
);

// Password hash करने के लिए pre middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Password compare करने का method
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    return false;
  }
};

// JWT token generate करने का method
userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

export const User = mongoose.model("User", userSchema);