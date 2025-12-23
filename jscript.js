const API_URL = "http://localhost:8080/api/todos"; // Change if needed
const todoList = document.getElementById("todoList");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const emptyMsg = document.getElementById("emptyMsg");

// Fetch all todos (READ)
async function fetchTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();
  todoList.innerHTML = "";

  if (todos.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  todos.forEach(todo => renderTodoItem(todo));
}

// Render single todo item
function renderTodoItem(todo) {
  const li = document.createElement("li");
  li.textContent = todo.title;

  const actions = document.createElement("div");
  actions.classList.add("actions");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit");
  editBtn.onclick = () => editTodo(todo);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete");
  deleteBtn.onclick = () => deleteTodo(todo.id);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  li.appendChild(actions);
  todoList.appendChild(li);
}

// Add new todo (CREATE)
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  if (!title) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  todoInput.value = "";
  fetchTodos();
});

// Edit todo (UPDATE)
async function editTodo(todo) {
  const newTitle = prompt("Edit your task:", todo.title);
  if (newTitle && newTitle.trim()) {
    await fetch('${API_URL}/${todo.id}', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, title: newTitle }),
    });
    fetchTodos();
  }
}

// Delete todo (DELETE)
async function deleteTodo(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    await fetch('${API_URL}/${id}', { method: "DELETE" });
    fetchTodos();
  }
}

// Initial load
fetchTodos();
