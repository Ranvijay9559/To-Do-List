const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const deadlineInput = document.getElementById('deadline-input');
const prioritySelect = document.getElementById('priority-select');
const filterSelect = document.getElementById('filter-select');
const catogorySelect = document.getElementById('category-select');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderFilteredTasks('all');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  const deadline = deadlineInput.value;
  const priority = prioritySelect.value;
  const category = catogorySelect.value;

  if (taskText !== "") {
    const task = {
      id: Date.now().toString(),
      text: taskText,
      timeStamp: new Date().toISOString(),
      completed: false,
      deadline: deadline,
      priority: priority,
      category: category
    };
    tasks.push(task);
    saveTasks();
    addTaskToDom(task);
    input.value = "";
    deadlineInput.value = "";
    prioritySelect.selectedIndex = 0;
    catogorySelect.selectedIndex = 0;
  }
});

function addTaskToDom(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id);

  // Priority & Category row
  const row = document.createElement('div');
  row.classList.add('priority-category-row');

  const priorityLabel = document.createElement('span');
  const priority = task.priority || 'low';
  priorityLabel.textContent = `Priority: ${priority}`;
  priorityLabel.classList.add('priority', priority.toLowerCase());

  const categoryLabel = document.createElement('span');
  const category = task.category || 'other';
  categoryLabel.textContent = `Category: ${category}`;
  categoryLabel.classList.add('category', category.toLowerCase());

  row.appendChild(priorityLabel);
  row.appendChild(categoryLabel);

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
      taskText.classList.toggle('completed', checkbox.checked);
      saveTasks();
    }
  });

  const actionsContainer = document.createElement('div');
  actionsContainer.classList.add('task-actions');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-button');
  editButton.style.marginLeft = 'auto';
  editButton.addEventListener('click', () => {
    handleEditTask(task, li);
  });
 


  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
  });

  actionsContainer.appendChild(editButton);
  li.appendChild(row);
  li.appendChild(checkbox);
  li.appendChild(taskText);
  if (task.deadline) li.appendChild(deadlineSpan);
  actionsContainer.appendChild(deleteButton);
  todoList.appendChild(li);
  li.appendChild(actionsContainer);
}

filterSelect.addEventListener('change', function () {
  renderFilteredTasks(filterSelect.value);
});

function renderFilteredTasks(filter) {
  todoList.innerHTML = '<li class="todo-list-header"><h3>List</h3></li>';

  tasks.forEach(task => {
    const taskPriority = (task.priority || 'low').toLowerCase();
    if (filter === "all" || taskPriority === filter) {
      addTaskToDom(task);
    }
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function handleEditTask(task, li) {
  const currentTask = task.text;
  const currentDeadline = task.deadline || '';
  const currentPriority = task.priority || 'low';
  const currentCategory = task.category || 'other';

  li.innerHTML = '';

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.value = currentTask;
  textInput.style.flexGrow = '1';

  const deadlineInput = document.createElement('input');
  deadlineInput.type = 'datetime-local';
  deadlineInput.value = currentDeadline;

  const prioritySelect = document.createElement('select');
  const priorities = ['low', 'medium', 'high'];
  priorities.forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    if(level === currentPriority) {
      option.selected = true;
    }
    prioritySelect.appendChild(option);
  });

  const categorySelect = document.createElement('select');
  ['work', 'personal', 'study', 'other'].forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === currentCategory) option.selected = true;
    categorySelect.appendChild(option);
  });

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.style.backgroundColor = '#28a745';
  saveButton.addEventListener('click', () => {
    task.text = textInput.value;
    task.deadline = deadlineInput.value;
    task.priority = prioritySelect.value;
    task.category = categorySelect.value;
    saveTasks();
    renderFilteredTasks(filterSelect.value);
  });

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.backgroundColor = 'grey';
  cancelButton.addEventListener('click', () => {
    li.innerHTML = "";

    renderFilteredTasks(filterSelect.value);
  });

  li.appendChild(textInput);
  li.appendChild(deadlineInput);
  li.appendChild(prioritySelect);
  li.appendChild(categorySelect);
  li.appendChild(saveButton);
  li.appendChild(cancelButton);

}