const mongoose = require('mongoose');
const Task = require('../models/task_model');
const User = mongoose.model('User');
const Image = require('../models/image_model');
// const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { log, Console } = require('console');
const Label = require('../models/label_model');

const getTaskImages = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const images = await Image.find({ taskID: taskId });
    const filepaths = images.map(image => image.filePath);
    res.json({ filepaths });
  } catch (error) {
    console.error('Error fetching task images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTasksSolved = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const tasksSolvedIds = user.tasksSolved;
    const tasks = await Task.find({ _id: { $in: tasksSolvedIds } }).populate('userID', 'name');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTasksGiven = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const tasks = await Task.find({ userID: userId });
    const tasksWithUserNames = tasks.map(task => {
      return {
        ...task.toObject(),
        userName: user.name // Assuming the user object has a 'name' property
      };
    });

    res.status(200).send(tasksWithUserNames);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
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
    const { userID, subject, type, numsolution, labels, images, text } = req.body;
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

    } else if(type === 'Text cataloging'){
      newTask = new Task({ 
        userID,
        subject, 
        type,
        numsolution, 
        text 
      });
      const savedTask = await newTask.save();

    } else if(type === 'Image cataloging'){
      newTask = new Task({
        userID,
        subject,
        type,
        numsolution
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
      newTask.images = savedImages.map(image => image._id);
    }
     else {
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
      task: savedTask, 
      user: user
    });
    return { user, tasks };
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const getTasksForLabeling = async (req, res) => {
  try {
    const tasks = await Task.find({ type: 'Text cataloging' }); // Fetch text cataloging tasks
    res.status(200).send(tasks);
  } catch (error) {
    console.error('Error fetching tasks for labeling:', error);
    res.status(500).json({ error: 'Internal server error' });
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

const solveTask = async (req, res) => {
  try {
    const { solution, labels } = req.body;
    console.log('Received solution:', solution);
    console.log('Received labels:', labels);
    const taskId = req.params.taskId;
    const userId = req.params.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    let images = [];
    if (task.type === 'Text cataloging') {
      const uniqueLabels = [...new Set([...task.labels, ...labels])];
      task.labels = uniqueLabels;
    } else if (task.type === 'Image classification' || task.type === 'Image cataloging') {
      images = await Image.find({ taskID: taskId });
      if (!images || images.length === 0) {
        return res.status(404).json({ error: 'Images not found for the task' });
      }

      console.log('Solutions:', solution);
      console.log('Images:', images);

      for (let i = 0; i < solution.length && i < images.length; i++) {
        if (images[i]) {
          if (task.type === 'Image classification') {
            if (!Array.isArray(solution[i].label)) {
              solution[i].label = [solution[i].label];
            }
            solution[i].label.forEach(label => {
              images[i].labels.push(label);
            });
          } else if (task.type === 'Image cataloging') {
            images[i].labels = [...images[i].labels, labels[i]];
          }
          await images[i].save();
        } else {
          console.error('Image not found for solution:', solution[i]);
        }
      }
    }

    task.status = 'Solved';
    await task.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.tasksSolved.push(task._id);
    user.solutions = user.solutions || [];

    for (let i = 0; i < solution.length && i < images.length; i++) {
      user.solutions.push({
        task: task._id,
        solution: solution[i].label || labels[i],
        image: images[i]._id
      });
    }
    await user.save();

    res.json({ message: 'Task solved successfully' });
  } catch (error) {
    console.error('Error solving task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteTask = async (req, res) => {
  const { user } = req;
  const taskId = req.params.taskId;
  try {
    console.log('Received taskId:', taskId);

    const task = await Task.findById(taskId);
    console.log('Recived task:', task);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task && task.userID && user && user.id && task.userID.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Task.deleteOne({ _id: taskId });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
      const taskId = req.params.taskId;
      console.log('Task ID:', taskId); // Add this line to debug
      const { subject, numsolution, labels, images, text } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { subject, numsolution, labels, images, text },
          { new: true }
      );

      if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
      }

      res.json(updatedTask);
  } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

const deleteImage = async (req, res) => {
    const { taskId, imageUrl } = req.body;

    // Log the incoming data
    console.log('Delete request received for taskId:', taskId, 'and imageUrl:', imageUrl);

    // Normalize the path to use forward slashes
    const normalizedImageUrl = imageUrl.replace(/\\/g, '/');

    try {
        const filePath = normalizedImageUrl.replace('http://localhost:3000/', '');
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(404).send('Image not found');
            }

            res.status(200).send('Image deleted successfully');
        });
    } catch (error) {
        console.error('Error processing delete request:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = { createTask, getTasks, uploadImages,
  getTaskImages, getTasksSolved, solveTask, getTasksGiven, 
  deleteTask, getTasksForLabeling, updateTask, deleteImage, };