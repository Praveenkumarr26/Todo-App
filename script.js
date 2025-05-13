// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoItems = document.getElementById('todo-items');
const priorityButtons = document.querySelectorAll('.priority-btn');
const themeToggle = document.getElementById('theme-toggle');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentPriority = 'high';

// Initialize
function init() {
  renderTodos();
  
  // Set active priority button
  priorityButtons.forEach(btn => {
    if (btn.dataset.priority === currentPriority) {
      btn.classList.add('active');
    }
  });
}

// Render todos
function renderTodos() {
  todoItems.innerHTML = '';
  
  if (todos.length === 0) {
    todoItems.innerHTML = '<li style="text-align: center; padding: 20px; color: #666;">No todos yet. Add one above!</li>';
    return;
  }

  todos.forEach(todo => {
    const todoItem = document.createElement('li');
    todoItem.className = `todo-item ${todo.priority} ${todo.completed ? 'completed' : ''}`;
    
    todoItem.innerHTML = `
      <span class="todo-text">${todo.text}</span>
      <div class="todo-actions">
        <button class="complete-btn" title="${todo.completed ? 'Uncomplete' : 'Complete'}">
          ${todo.completed ? '↩' : '✓'}
        </button>
        <button class="delete-btn" title="Delete">🗑️</button>
      </div>
    `;
    
    // Add event listeners
    const completeBtn = todoItem.querySelector('.complete-btn');
    const deleteBtn = todoItem.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => toggleComplete(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    todoItems.appendChild(todoItem);
  });
}

// Add todo
function addTodo(text, priority) {
  const newTodo = {
    id: Date.now(),
    text,
    priority,
    completed: false
  };
  
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

// Delete todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Toggle complete
function toggleComplete(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Event listeners
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    addTodo(text, currentPriority);
    todoInput.value = '';
  }
});

priorityButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    priorityButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPriority = btn.dataset.priority;
  });
});

themeToggle.addEventListener('click', toggleTheme);

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Initialize the app
init();
