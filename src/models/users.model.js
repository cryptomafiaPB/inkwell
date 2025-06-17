import mongoose from "mongoose";

const userChema = mongoose.Schema({});

const User = mongoose.model("User", userChema);

export default User;
