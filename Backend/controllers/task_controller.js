const Task = require('../models/task_model');

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
    const { subject, type, numsolution } = req.body;
    const newTask = new Task({ subject, type, numsolution });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

module.exports = { createTask, getTasks };