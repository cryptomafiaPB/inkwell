import express from "express";
import app from "./app.js";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

// common middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
