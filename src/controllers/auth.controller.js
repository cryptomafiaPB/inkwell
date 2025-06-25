/* eslint-disable no-unused-vars */

import { ApiError } from "../utils/api-error.js";
import User from "../models/users.model.js";
import { ApiResponse } from "../utils/api-responce.js";
import APIKey from "../models/api_keys.model.js";
import crypto from "crypto";
import {
  loginSchema,
  registerSchema,
  reqUserSchema,
} from "../validators/authSchema.js";

const unselectedUserFields = "-password -api_keys -createdAt -updatedAt -__v";

const registerUser = async (req, res) => {
  try {
    const { email, password, username, fullname, role } = registerSchema.parse(
      req.body
    );

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(400, "Email already exists");
    }

    const user = await User.create({
      email,
      password,
      username,
      fullname,
      role,
    });

    const userWithoutSensitiveData = {
      ...user.toObject(),
      password: undefined,
      api_keys: undefined,
    };

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: userWithoutSensitiveData },
          "Account created successfully"
        )
      );
  } catch (error) {
    console.log("error in register: ", error);
    throw new ApiError(error.statusCode, error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      throw new ApiError(404, "Invalid email");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = user.generateAuthToken();

    const cookieOptions = {
      httpOnly: true,
      secure: false, // in Production set to true
      sameSite: "lax", // helps with CSRF and cross-site sending
      maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    // remove password and api_keys from user object
    const userWithoutSensitiveData = {
      ...user.toObject(),
      password: undefined,
      api_keys: undefined,
    };

    return res
      .cookie("id", token, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userWithoutSensitiveData, token },
          "Login successful"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(error.statusCode, error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("id");
    return res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
  } catch (error) {
    console.log("Logout error: ", error);
    throw new ApiError(500, "Logout failed");
  }
};

const generateAPIKey = async (req, res) => {
  try {
    //  verify user is exists
    const { id, role } = reqUserSchema.parse(req.user);
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // generate API key
    const key = await crypto.randomBytes(32).toString("hex");
    // save
    const apiKey = await APIKey.create({
      api_keys: key,
      user: user._id,
    });

    if (!apiKey) {
      throw new ApiError(500, "Failed to generate API key");
    }

    // Update user with API key reference
    await User.findByIdAndUpdate(user._id, {
      $push: { api_keys: apiKey._id },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { key: apiKey.api_keys },
          "API key generated successfully"
        )
      );
  } catch (error) {
    console.log("API key generation failed:", error);
    throw new ApiError(error.statusCode, error.message);
  }
};

const getMe = async (req, res) => {
  try {
    const { id } = req.user;
    // dont include password and api_keys in response
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const userWithoutSensitiveData = {
      ...user.toObject(),
      password: undefined,
      api_keys: undefined,
    };
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userWithoutSensitiveData,
          "User data retrieved successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(error.statusCode, error.message);
  }
};

export { registerUser, loginUser, logoutUser, generateAPIKey, getMe };
