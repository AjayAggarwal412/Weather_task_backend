const axios = require("axios");
const Task = require("../Models/TaskModel");
require("dotenv").config();

// Fetch weather from OpenWeatherMap
const getWeather = async (city) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.data.weather[0].description; // Return weather description
  } catch (error) {
    throw new Error("Weather data could not be fetched.");
  }
};

// Add Task
module.exports.addTask = async (req, res) => {
  const { title, description, status, city } = req.body;

  try {
    const weather = await getWeather(city);
    const newTask = new Task({
      title,
      description,
      status,
      weather,
      city,
    });

    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks
module.exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found" });
    }
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Delete Task Controller
module.exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Task Controller
// module.exports.updateTask = async (req, res) => {
//   const { title, description, status } = req.body;
//   const taskId = req.params.id;

//   try {
//     // Find task by ID and update it
//     const updatedTask = await Task.findByIdAndUpdate(
//       taskId,
//       { title, description, status },
//       { new: true } // Return the updated document
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     res.status(200).json({ task: updatedTask });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports.updateTask = async (req, res) => {
  const { title, description, status, city } = req.body; // Destructure the new city
  const taskId = req.params.id;

  try {
    // Fetch weather data based on the city entered by the user
    const weatherData = await getWeather(city);

    // Find task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, city, weather: weatherData }, // Update weather and city
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
