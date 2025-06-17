import mongoose from "mongoose";
import { lowercase, toLowerCase, trim } from "zod/v4";
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
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: {
        url: string,
        localPath: string,
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
      type: Schema.Types.ObjectId,
      ref: "APIKey",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userChema);

export default User;
