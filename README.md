# Task Manager

## Description

Task Manager is a fullstack web application that allows users to manage their daily tasks. Users can sign up, log in, add tasks, update their status, archive tasks, and delete them. The application is built using Express.js for the backend and NeDB for data storage.

## Features

- User authentication (Signup/Login) with JWT.
- Add, view, update, archive, and delete tasks.
- Saved in local storage using NeDB.
- Responsive and user-friendly interface.

## File Structure

```file
final_project/
├── .gitignore               # Files and directories to ignore in Git
├── index.js                 # Main server file
├── package.json             # Project metadata and dependencies
├── tasks.jsonl              # Task data (NeDB storage)
├── users.jsonl              # User data (NeDB storage)
├── public/                  # Frontend files
│   ├── index.html           # Main application page
│   ├── login.html           # Login page
│   ├── signup.html          # Signup page
│   ├── script.js            # Frontend JavaScript logic
│   ├── style.css            # Styling for the application
```

## Dependencies

The project uses the following dependencies:

- express: Web framework for Node.js.
- nedb: Lightweight local database for storing tasks and users.
- bcrypt: For hashing passwords.
- jsonwebtoken: For generating and verifying JWT tokens.

## Backend

The backend is implemented in index.js and provides the following endpoints:

- POST /signup: Create a new user.
- POST /login: Authenticate a user.
- POST /tasks: Add a new task.
- GET /tasks: Retrieve tasks for the logged-in user.
- PUT /tasks/:id: Update the status of a task.
- PUT /tasks/:id/archive: Archive a task.
- DELETE /tasks/:id: Delete a task.
