const mongoose = require('mongoose');
const Task = require('../models/task_model');
const User = mongoose.model('User');
const Image = require('../models/image_model');

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
    const { userID ,subject, type, numsolution } = req.body;
    console.log('Received data:', { userID ,subject, type, numsolution });
    const newTask = new Task({ userID, subject, type, numsolution });
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
     task: newTask,
     numsolution: savedTask.numsolution,
     subject: savedTask.subject,
     userID: savedTask.userID,
     type: savedTask.type
     });
    return { user, tasks };
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const imageClassification = async (req, res) => {
  try {
    const { userID, images, labels, numsolution, type, subject } = req.body;
    const newTask = new Task({
      userID,
      taskType: 'image classification',
      images,
      labels,
      numsolution,
      type,
      subject,
    });
    const savedTask = await newTask.save();
    req.files = images;

    const uploadReq = {
      body: {
        userID,
        taskID: savedTask._id,
        files: images
      }
    };
    await uploadImages(uploadReq, res);

    // res.status(201).json({ message: 'Image classification task created successfully', task: savedTask });
  } catch (error) {
    console.error('Failed to create image classification task:', error);
    res.status(500).json({ error: 'Failed to create image classification task' });
  }
};

const uploadImages = async (req, res) => {
  try {
    const { userID, taskID } = req.body; 
    const images = req.files ? req.files.map(file => ({
      filename: file.filename,
      userID: userID,
      taskID: taskID,
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

module.exports = { createTask, getTasks, imageClassification, uploadImages,
  getTasksSolved };