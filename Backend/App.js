const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const userRoute = require("./routes/user_route");
const taskRoute = require("./routes/task_route");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); 
const path = require('path');

const initApp = () => {
  const promise = new Promise(async (resolve) => {
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", () => console.log("Database connected"));
    await mongoose.connect(process.env.DATABASE_URL);
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(cors());
    app.use("/user", userRoute);
    app.use("/task", taskRoute);
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        return cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
      }
    });

    const upload = multer({ storage: storage,  limits: { fileSize: 10 * 1024 * 1024 } });

    app.post("/upload-image", upload.array('images'), (req, res) => {
      console.log(req.body);
      console.log(req.files);
      res.status(200).json({ message: 'Images uploaded successfully' });
    });
    
    resolve(app);
  });
  return promise;
};

module.exports = initApp;