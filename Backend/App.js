const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const userRoute = require("./routes/user_route");
const taskRoute = require("./routes/task_route");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); 
const Task = require('./models/task_model');
const Image = require('./models/image_model');

const initApp = () => {
  const promise = new Promise(async (resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    await mongoose.connect(process.env.DATABASE_URL);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use("/user", userRoute);
    app.use("/task", taskRoute);

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "../frontend/images");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
      },
    });
    const upload = multer({ storage: storage });

    app.post("/upload-image", upload.array("images"), async (req, res) => {
      try {
        const taskID = req.body.taskID;
        const images = req.files.map(file => ({
          filename: file.filename,
          contentType: file.mimetype,
          size: file.size
        }));
        const updatedTask = await Task.findByIdAndUpdate(taskID, { $push: { images: { $each: images } } }, { new: true });
        if (!updatedTask) {
          return res.status(404).json({ error: "Task not found" });
        }
        res.status(201).json({ message: "Image classification task created successfully", task: updatedTask });
      } catch (error) {
        console.error('Failed to create image classification task:', error);
        res.status(500).json({ error: 'Failed to create image classification task' });
      }
    });
    resolve(app);
  });
  return promise;
};

module.exports = initApp;