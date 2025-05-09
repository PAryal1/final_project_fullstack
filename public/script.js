let token = localStorage.getItem('token');
let username = localStorage.getItem('username');
let userId = token ? parseJwt(token).userId : null;

if (!token) {
  window.location.href = 'login.html';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-msg').style.display = 'block';
} else {
  document.getElementById('app').style.display = 'block';
  document.getElementById('login-msg').style.display = 'none';
  document.getElementById('user').innerText = username;
  loadTasks();
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

function loadTasks() {
  fetch(`/tasks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `[${task.status}] ${task.content}`;
        li.innerHTML += `
          <button onclick="updateStatus('${task._id}', 'done')">Done</button>
          <button onclick="archiveTask('${task._id}')">Archive</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        list.appendChild(li);
      });
    });
}

function addTask() {
  const content = document.getElementById('taskInput').value;
  fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  }).then(loadTasks);
}

function updateStatus(id, status) {
  fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  }).then(loadTasks);
}

function archiveTask(id) {
  fetch(`/tasks/${id}/archive`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(loadTasks);
}

function deleteTask(id) {
  fetch(`/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(loadTasks);
}
