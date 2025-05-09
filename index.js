const express = require('express');
const Datastore = require('nedb');
const path = require('path');
const app = express();
const PORT = 3000;

const usersDB = new Datastore({ filename: 'users.jsonl', autoload: true });
const tasksDB = new Datastore({ filename: 'tasks.jsonl', autoload: true });

app.use(express.static('public'));
app.use(express.json());

// Signup
app.post('/signup', (req, res) => {
  const { username } = req.body;
  usersDB.findOne({ username }, (err, user) => {
    if (user) return res.status(409).json({ error: 'Username taken' });
    usersDB.insert({ username }, (err, newUser) => {
      res.json({ userId: newUser._id });
    });
  });
});

// Login
app.post('/login', (req, res) => {
  const { username } = req.body;
  usersDB.findOne({ username }, (err, user) => {
    if (user) {
      res.json({ userId: user._id });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// CRUD routes for tasks (same as before)
app.post('/tasks', (req, res) => {
  const { userId, content } = req.body;
  const task = { userId, content, status: 'pending', created: new Date() };
  tasksDB.insert(task, (err, newTask) => res.json(newTask));
});

app.get('/tasks/:userId', (req, res) => {
  tasksDB.find({ userId: req.params.userId, archived: { $ne: true } }).sort({ created: -1 }).exec((err, tasks) => res.json(tasks));
});

app.put('/tasks/:id', (req, res) => {
  tasksDB.update({ _id: req.params.id }, { $set: { status: req.body.status } }, {}, () => res.json({ success: true }));
});

app.put('/tasks/:id/archive', (req, res) => {
  tasksDB.update({ _id: req.params.id }, { $set: { archived: true } }, {}, () => res.json({ success: true }));
});

app.delete('/tasks/:id', (req, res) => {
  tasksDB.remove({ _id: req.params.id }, {}, () => res.json({ success: true }));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
