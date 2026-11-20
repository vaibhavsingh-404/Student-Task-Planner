const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function updateSummary() {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("progressText").textContent = percentage + "%";
  document.getElementById("progressBar").style.width = percentage + "%";
}

function renderTasks() {
  taskList.innerHTML = "";
  const selectedFilter = filter.value;

  const visibleTasks = tasks.filter(task => {
    if (selectedFilter === "pending") return !task.completed;
    if (selectedFilter === "completed") return task.completed;
    return true;
  });

  emptyMessage.hidden = visibleTasks.length > 0;

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    const priorityTag = document.createElement("span");
    priorityTag.className = "priority " + task.priority;
    priorityTag.textContent = task.priority;
    name.appendChild(priorityTag);

    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.textContent = task.dueDate ? "Due: " + task.dueDate : "No due date";

    details.append(name, meta);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(currentTask => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, details, deleteButton);
    taskList.appendChild(item);
  });

  updateSummary();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = taskName.value.trim();
  if (!name) return;

  tasks.push({
    id: Date.now(),
    name,
    dueDate: dueDate.value,
    priority: priority.value,
    completed: false
  });

  saveTasks();
  taskForm.reset();
  renderTasks();
  taskName.focus();
});

filter.addEventListener("change", renderTasks);

renderTasks();
