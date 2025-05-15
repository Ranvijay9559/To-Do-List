const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const deadlineInput = document.getElementById('deadline-input');
const prioritySelect = document.getElementById('priority-select');
const filterSelect = document.getElementById('filter-select');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderFilteredTasks('all');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  const deadline = deadlineInput.value;
  const priority = prioritySelect.value;

  if (taskText !== "") {
    const task = {
      id: Date.now().toString(),
      text: taskText,
      timeStamp: new Date().toISOString(),
      completed: false,
      deadline: deadline,
      priority: priority
    };
    tasks.push(task);
    saveTasks();
    addTaskToDom(task);
    input.value = "";
    deadlineInput.value = "";
    prioritySelect.selectedIndex = 0;
  }
});

function addTaskToDom(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.style.width = '18px';
  checkbox.style.height = '18px';

  const taskText = document.createElement('span');
  taskText.textContent = `${task.text} (added on ${new Date(task.timeStamp).toLocaleString()})`;
  taskText.classList.add('task-text');
  if (task.completed) {
    taskText.classList.add('completed');
  }

  const deadlineSpan = document.createElement('span');
  if (task.deadline) {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();

    deadlineSpan.textContent = `Deadline: ${deadlineDate.toLocaleString()}`;
    deadlineSpan.classList.add('deadline');

    if (deadlineDate < now && !task.completed) {
      deadlineSpan.classList.add('overdue');
    }
  }


  checkbox.addEventListener('change', () => {
    const taskId = li.getAttribute('data-id');
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask) {
      targetTask.completed = checkbox.checked;
      if (checkbox.checked) {
        taskText.classList.add('completed');
      } else {
        taskText.classList.remove('completed');
      }
      saveTasks();
    }
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
  });

  const priority = task.priority || 'low';

  const priorityLabel = document.createElement('span');
  priorityLabel.textContent = `Priority: ${priority}`;
  priorityLabel.classList.add('priority', priority.toLowerCase());
  li.classList.add(priority.toLowerCase());

  li.appendChild(priorityLabel);
  li.appendChild(checkbox);
  li.appendChild(taskText);
  if (task.deadline) li.appendChild(deadlineSpan);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

filterSelect.addEventListener('change', function() {
  renderFilteredTasks(filterSelect.value);
});

function renderFilteredTasks(filter) {
  todoList.innerHTML = '<li class="todo-list-header"><h3>List</h3></li>';

  tasks.forEach(task => {
    const taskPriority = (task.priority || 'low').toLowerCase();
    if(filter === "all" || taskPriority === filter) {
      addTaskToDom(task);
    }
  })
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
