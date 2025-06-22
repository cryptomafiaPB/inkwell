/* eslint-disable no-undef */
import mongoose from "mongoose";
import { AvailableRoles, UserRoleEnum } from "../utils/constants.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/600x400`,
        localPath: ``,
      },
    },
    role: {
      type: String,
      enum: AvailableRoles,
      default: UserRoleEnum.USER,
    },
    api_key: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "APIKey",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // don't return isDeleted
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  if (!this.password) {
    throw new Error("Password not set");
  }
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

userSchema.methods.compareResetPasswordToken = function (token) {
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  return (
    hashToken === this.resetPasswordToken &&
    this.resetPasswordExpire > Date.now()
  );
};

const User = mongoose.model("User", userSchema);

export default User;
