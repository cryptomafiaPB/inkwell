import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-responce.js";

const healthCheck = (req, res) => {
  try {
    res.status(200).json(new ApiResponse(200, "Healthy"));
  } catch (error) {
    console.error("healthCheck error: ", error);
    throw new ApiError(400, error.message);
  }
};

export { healthCheck };
