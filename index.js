require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/auth");

const app = express();
app.use(express.json());

app.use("/api/auth/", authRoutes);

//app.use(authMiddleware);
app.use(errorHandlerMiddleware);

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
