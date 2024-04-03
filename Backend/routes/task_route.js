const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task_controller");

router.post('/create-tasks', TaskController.createTask);
router.post('/:taskId/:userId/solve', TaskController.solveTask);
router.get("/solve-tasks", TaskController.getTasks);
router.get('/get-tasks/:userId', TaskController.getTasksGiven);
router.get('/get-solved-tasks/:userId', TaskController.getTasksSolved);
router.post('/upload-image', TaskController.uploadImages);
router.get('/get-images/:taskId', TaskController.getTaskImages);
router.delete('/delete-task/:taskId', TaskController.deleteTask);
  
module.exports = router;