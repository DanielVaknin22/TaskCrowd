const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
const userRoute = require("./routes/user_route");
const taskRoute = require("./routes/task_route");
const bodyParser = require("body-parser");

const initApp = () => {
  const promise = new Promise(async (resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    await mongoose.connect(process.env.DATABASE_URL);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use("/user", userRoute);
    app.use("/task", taskRoute);
    resolve(app);
  });
  return promise;
};

module.exports = initApp;