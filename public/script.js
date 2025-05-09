let userId = localStorage.getItem('userId');
let username = localStorage.getItem('username');

if (!userId) {
  window.location.href = 'login.html';
} else {
  document.getElementById('app').style.display = 'block';
  document.getElementById('user').innerText = username;
  loadTasks();
}

function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

function loadTasks() {
  fetch(`/tasks/${userId}`)
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, content })
  }).then(loadTasks);
}

function updateStatus(id, status) {
  fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(loadTasks);
}

function archiveTask(id) {
  fetch(`/tasks/${id}/archive`, { method: 'PUT' }).then(loadTasks);
}

function deleteTask(id) {
  fetch(`/tasks/${id}`, { method: 'DELETE' }).then(loadTasks);
}
