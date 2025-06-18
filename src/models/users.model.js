import mongoose from "mongoose";
import { AvailableRoles, UserRoleEnum } from "../utils/constants";

const userChema = mongoose.Schema(
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
      select: false, // don't return password
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

const User = mongoose.model("User", userChema);

export default User;
