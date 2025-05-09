const express = require("express");
const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 3000;
const SECRET = "jwt-secrete-key-random-generated";

const usersDB = new Datastore({ filename: "users.jsonl", autoload: true });
const tasksDB = new Datastore({ filename: "tasks.jsonl", autoload: true });

app.use(express.static("public"));
app.use(express.json());

// JWT auth
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  usersDB.findOne({ username }, async (err, user) => {
    if (user) return res.status(409).json({ error: "Username taken" });
    const hashedPassword = await bcrypt.hash(password, 10);
    usersDB.insert({ username, password: hashedPassword }, (err, newUser) => {
      const token = jwt.sign({ 
        userId: newUser._id,
         username },
          SECRET);
      res.json({ token, username });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  usersDB.findOne({ username }, async (err, user) => {
    if (!user) return res.status(404).json({ error: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id, username }, SECRET);
    res.json({ token, username });
  });
});

// Create task
app.post("/tasks", authenticateToken, (req, res) => {
  const { content } = req.body;
  const task = {
    userId: req.user.userId,
    content,
    status: "pending",
    created: new Date(),
  };
  tasksDB.insert(task, (err, newTask) => res.json(newTask));
});

// Get tasks
app.get("/tasks", authenticateToken, (req, res) => {
  tasksDB
    .find({ userId: req.user.userId, archived: { $ne: true } })
    .sort({ created: -1 })
    .exec((err, tasks) => res.json(tasks));
});

// Update status
app.put("/tasks/:id", authenticateToken, (req, res) => {
  tasksDB.update(
    { _id: req.params.id },
    { $set: { status: req.body.status } },
    {},
    () => {
      res.json({ success: true });
    }
  );
});

// Archive task
app.put("/tasks/:id/archive", authenticateToken, (req, res) => {
  tasksDB.update(
    { _id: req.params.id },
    { $set: { archived: true } },
    {},
    () => {
      res.json({ success: true });
    }
  );
});

// Delete task
app.delete("/tasks/:id", authenticateToken, (req, res) => {
  tasksDB.remove({ _id: req.params.id }, {}, () => {
    res.json({ success: true });
  });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
