require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/auth");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json());

app.use("/api/auth/", authRoutes);

//app.use(authMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log("Speak for the app is listening");
    });
  } catch (err) {
    console.log(err);
  }
};
start();
