import mongoose from "mongoose";

const APIKeySchema = mongoose.Schema({
  api_keys: {
    type: String,
    required: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const APIKey = mongoose.model("APIKey", APIKeySchema);

export default APIKey;
