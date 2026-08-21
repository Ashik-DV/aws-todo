const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Temporary in-memory data
let tasks = [
    {
        id: 1,
        task: "Learn AWS EC2"
    },
    {
        id: 2,
        task: "Learn Docker"
    }
];

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "AWS Todo API is running 🚀"
    });
});

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Create a task
app.post("/tasks", (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({
            message: "Task is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        task: task
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const taskExists = tasks.some(task => task.id === id);

    if (!taskExists) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks = tasks.filter(task => task.id !== id);

    res.json({
        message: "Task deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});