const mongoose = require('mongoose');
const Task = require('../models/task_model');
const User = mongoose.model('User');
const Image = require('../models/image_model');
// const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const getTaskImages = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    // Retrieve images associated with the specified taskId
    const images = await Image.find({ taskID: taskId });
    // Extract file paths from images and return as response
    const filepaths = images.map(image => image.filePath);
    res.json({ filepaths });
  } catch (error) {
    console.error('Error fetching task images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

getTasksSolved = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ solvedBy: userId });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.query.name) {
      tasks = await Task.find({ userID: req.query.userID });
    } else {
      tasks = await Task.find();
    }

    const tasksWithUserNames = await Promise.all(tasks.map(async (task) => {
      const user = await User.findById(task.userID); 
      const userName = user ? user.name : 'Unknown'; 
      return {
        ...task.toObject(),
        userName
      };
    }));

    res.status(200).send(tasksWithUserNames);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const createTask = async (req, res) => {
  try {
    console.log("create task");
    const { userID, subject, type, numsolution, labels, images } = req.body;
    console.log('Received data:', { userID, subject, type, numsolution });
    let newTask;

    if (type === 'Image classification') {
      newTask = new Task({
        userID,
        subject,
        type,
        numsolution,
        labels,
      });

      const savedTask = await newTask.save();

      const savedImages = await Promise.all(images.map(async (base64ImageData) => {
        const base64Image = base64ImageData.split(';base64,').pop();
        const filename = `image_${Date.now()}.jpg`; 
        const directoryPath = path.join(__dirname, '..', 'uploads');
        const filePath = path.join('uploads', filename);
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
        }

        await fs.promises.writeFile(filePath, base64Image, { encoding: 'base64' });
        
        const newImage = new Image({
          taskID: savedTask._id,
          userID,
          filename,
          filePath,
        });
        return await newImage.save();
      }));
      console.log('Received data:', { userID, subject, type, numsolution, labels });
      newTask.images = savedImages.map(image => image._id);

    } else {
      newTask = new Task({ userID, subject, type, numsolution });
    }

    const savedTask = await newTask.save();
    const tasks = await Task.find();
    const user = await User.findById(userID);
    console.log('User:', user);

    if (!user.tasks.includes(savedTask._id)) {
      user.tasks.push(savedTask._id);
      await user.save();
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask
    });
    return { user, tasks };
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const uploadImages = async (req, res) => {
  try {
    const { userID, taskID } = req.body; 
    const images = req.files && Array.isArray(req.files) ? req.files.map(file => ({
      filename: file.filename,
      userID: userID,
      taskID: taskID,
      filePath: `../uploads/${file.filename}`,
    })) : [];
    if (images.length === 0) {
      throw new Error('No files found in the request');
    }
    const savedImages = await Image.insertMany(images);
    const imageIDs = savedImages.map(image => image._id);
    const updatedTask = await Task.findByIdAndUpdate(taskID, { $push: { images: { $each: imageIDs } } }, { new: true });

    res.status(201).json({ message: 'Images uploaded successfully', task: updatedTask });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// const solvingTask = async (req, res) => {
  
// }

module.exports = { createTask, getTasks, uploadImages,
  getTaskImages, getTasksSolved };