require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("Speak for the app is listening");
    });
  } catch (err) {
    console.log(err);
  }
};
start();
