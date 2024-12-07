const express = require("express");
const router = express.Router();
const {
  addTask,
  getTasks,
  deleteTask,
  updateTask,
} = require("../Controllers/TaskController");

// Add Task Route
router.post("/tasks", addTask);

// Get Tasks Route
router.get("/tasks", getTasks);

router.delete("/tasks/:id", deleteTask);

router.put("/tasks/:id", updateTask);

module.exports = router;
