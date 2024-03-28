const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/task_controller");

router.post('/create-tasks', TaskController.createTask);
router.get("/solve-tasks", TaskController.getTasks);
router.post('/create-image-classification-task', TaskController.imageClassification);
// router.get('/solve-task', TaskController.solvingTask);


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