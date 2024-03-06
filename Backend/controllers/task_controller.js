const mongoose = require('mongoose');
const Task = require('../models/task_model');
const User = mongoose.model('User');

const getTasks = async (req, res) => {
  console.log("task get");
  try {
    let task;
    if (req.query.name) {
      task = await Task.find({ name: req.query.name });
    } else {
      task = await Task.find();
    }
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const createTask = async (req, res) => {
  try {
    console.log("create task");
    const { userID ,subject, type, numsolution } = req.body;
    const newTask = new Task({ userID, subject, type, numsolution });
    const savedTask = await newTask.save();
    const tasks = await Task.find();
    const user = await User.findById(userID);
    console.log('User:', user);
    if (!user.tasks.includes(savedTask._id)) {
      user.tasks.push(savedTask._id);
      await user.save();
    }
    res.status(201).json({ message: 'Task created successfully', task: newTask });
    return { user, tasks };
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const imageClassification = async (req, res) => {
  try {
    const { userID, imagePaths, labels } = req.body;
    const newTask = new Task({
      userID,
      taskType: 'image classification',
      imagePaths,
      labels,
    });
    const savedTask = await newTask.save();
    res.status(201).json({ message: 'Image classification task created successfully', task: savedTask });
  } catch (error) {
    // Handle errors
    console.error('Failed to create image classification task:', error);
    res.status(500).json({ error: 'Failed to create image classification task' });
  }
};


module.exports = { createTask, getTasks, imageClassification };