const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const Task = require('./models/tasks');
const User = require('./models/users');
const cors=require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/taskcreation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
// Register the users
app.post('/register', async (req, res) => {
  const { username, email, password} = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// add tasks
app.post('/tasks', async (req, res) => {
    const { Title, Description, DueDate, Priority } = req.body;
    try {
      const newTask = new Task({
        Title,
        Description,
        DueDate,
        Priority,
      });
      await newTask.save();
      return res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
      console.error('Error adding task:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Update task data
app.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const { Title, Description, DueDate, Priority } = req.body;
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, {
        Title,
        Description,
        DueDate,
        Priority,
      });
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
      const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Get all task data
app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
