/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/api-error.js";
import APIKey from "../models/api_keys.model.js";

const authenticateJWT = (req, res, next) => {
  // get JWT token from request header bearer token
  const token =
    req.headers.authorization?.replace("Bearer ", "") ?? req.cookies?.id;
  if (!token || token === "null") {
    return res.status(401).json(new ApiError(401, "Unauthorized"));
  }
  // verify token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    // attach user to req.user = {id: id, role: role}
    req.user = { id: payload.id, role: payload.role };
  } catch (error) {
    // Invalid token -> reject immediately
    return res.status(401).json(new ApiError(401, "Invalid or Expired token"));
  }
  // next()
  next();
};
const authenticateAPI = async (req, res, next) => {
  // get API key from request header [x-api-key]
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json(new ApiError(401, "Unauthorized"));
  }
  //   query DB 'api_keys' model and findOne {apikey, revoked: false}. Then populate user
  try {
    const user = await APIKey.findOne({
      api_keys: key,
      revoked: false,
    }).populate("user");
    // attach user to req.user = {id: user._id, role: user.role}
    req.user = { id: user.user._id.toString(), role: user.user.role };
  } catch (error) {
    // Invalid API key -> reject immediately
    return res.status(401).json(new ApiError(401, "Invalid or Revoked Key"));
  }
  // next()
  next();
};

// First authenticateJWT then authenticateAPI

export const authenticate = [authenticateJWT, authenticateAPI];
