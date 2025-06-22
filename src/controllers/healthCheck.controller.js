import { ApiResponce } from "../utils/api-responce.js";

const healthCheck = (req, res) => {
  res.status(200).json(new ApiResponce(200, "Healthy"));
};

export { healthCheck };
