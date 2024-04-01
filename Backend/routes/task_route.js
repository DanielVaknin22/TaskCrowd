const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task_controller");

router.post('/create-tasks', TaskController.createTask);
router.get("/solve-tasks", TaskController.getTasks);
// router.post('/create-tasks', TaskController.imageClassification);
router.get('/get-tasks', TaskController.getTasks);
router.get('/get-solved-tasks', TaskController.getTasksSolved);
router.post('/upload-image', TaskController.uploadImages);
router.get('/get-images/:taskId', TaskController.getTaskImages);


// router.get("/", (req, res) => {
//   res.send("task get");
// });

// router.get("/:id", (req, res) => {
//   res.send("post get by id");
// });
  
// router.post("/", (req, res) => {
//   res.send("task post" + req.body);
// });
  
// router.put("/:id", (req, res) => {
//   res.send("task put");
// });
  
// router.delete("/:id", (req, res) => {
//   res.send("task delete");
// });
  
module.exports = router;