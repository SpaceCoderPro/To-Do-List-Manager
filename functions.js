        // Your existing JavaScript code here

        // Add these new functions for book management
        let books = [];

        function addBook() {
            const bookInput = document.getElementById('bookInput');
            const bookTitle = bookInput.value.trim();
            if (bookTitle) {
                books.push({ id: Date.now(), title: bookTitle });
                bookInput.value = '';
                saveData();
                renderBooks();
            }
        }

        function renderBooks() {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = books.map(book => `
                <li class="book-item">
                    <span>${book.title}</span>
                    <button onclick="deleteBook(${book.id})"><i class="fas fa-trash"></i></button>
                </li>
            `).join('');
        }

        function deleteBook(bookId) {
            books = books.filter(book => book.id !== bookId);
            saveData();
            renderBooks();
        }

        // Modify your existing saveData and loadData functions to include books
        function saveData() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('tags', JSON.stringify(tags));
            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('userName', userName);
        }

        function loadData() {
            tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tags = JSON.parse(localStorage.getItem('tags')) || { personal: ['Personal'], school: ['School'] };
            books = JSON.parse(localStorage.getItem('books')) || [];
            userName = localStorage.getItem('userName') || '';
        }
let isSubtasksOpen = 0;
function toggleSubtasks(taskId) {
  const subtasksList = document.querySelector(`#subtasks-${taskId}`);
  const dropdownIcon = document.querySelector(`#dropdown-${taskId}`);

  if (subtasksList) {
    subtasksList.style.display = isSubtasksOpen === 0 ? 'block' : subtasksList.style.display === 'none' ? 'block' : 'none';
    dropdownIcon.classList.toggle('fa-chevron-down');
    dropdownIcon.classList.toggle('fa-chevron-up');

    // Update flag based on current state
    isSubtasksOpen = isSubtasksOpen === 0 ? 1 : 0;

    // Save the subtask's state to local storage
    localStorage.setItem(`subtaskState-${taskId}`, isSubtasksOpen);

    // Ensure the subtask state is applied to all subtasks (optional)
    // Implement the logic from the previous responses here if needed
  }
}
        // Make sure to call renderBooks in your init function
        function init() {
            loadData();
            if (!userName) {
                userName = prompt("Please enter your name:");
                if (userName) {
                    localStorage.setItem('userName', userName);
                }
            }
            updateGreeting();
            updateTagSelect();
            renderTasks();
            renderTagList();
            renderBooks();
            updateCharts();
        }
// Global variables
let tasks = [];
let tags = { personal: ['Personal'], school: ['School'] };
let currentTab = 'personal';
let userName = '';
let priorityChart, tagChart;

// Initialization function
function init() {
    loadData();
    if (!userName) {
        userName = prompt("Please enter your name:");
        if (userName) {
            localStorage.setItem('userName', userName);
        }
    }
    updateGreeting();
    updateTagSelect();
    renderTasks();
    renderTagList();
    updateCharts();
}

// Update greeting message
function updateGreeting() {
    document.getElementById('greeting').textContent = `Welcome, ${userName || 'Guest'}!`;
}
function addSubtask(parentId) {
    const subtaskText = prompt("Enter subtask:");
    if (subtaskText) {
        const newSubtask = {
            id: Date.now(),
            text: subtaskText,
            completed: false,
            subtasks: [],
            priority: 'low',
            tag: '',
            dueDate: '',
            tab: currentTab
        };
        addSubtaskToTask(tasks, parentId, newSubtask);
        saveData();
        renderTasks();
    }
}


function addSubtaskToTask(taskList, parentId, newSubtask) {
    for (let task of taskList) {
        if (task.id === parentId) {
            task.subtasks.push(newSubtask);
            return true;
        }
        if (task.subtasks && task.subtasks.length > 0) {
            if (addSubtaskToTask(task.subtasks, parentId, newSubtask)) {
                return true;
            }
        }
    }
    return false;
}

function toggleCompletion(taskId) {
    toggleCompletionRecursive(tasks, taskId);
    saveData();
    renderTasks();
    updateCharts();
}
function toggleCompletionRecursive(taskList, taskId) {
    for (let task of taskList) {
        if (task.id === taskId) {
            task.completed = !task.completed;
            return true;
        }
        if (task.subtasks && task.subtasks.length > 0) {
            if (toggleCompletionRecursive(task.subtasks, taskId)) {
                return true;
            }
        }
    }
    return false;
}

// Edit task or subtask
function editTask(taskId) {
    editTaskRecursive(tasks, taskId);
    saveData();
    renderTasks();
}
function editTaskRecursive(taskList, taskId) {
    for (let task of taskList) {
        if (task.id === taskId) {
            const newText = prompt("Edit task:", task.text);
            if (newText !== null) {
                task.text = newText;
            }
            return true;
        }
        if (task.subtasks && task.subtasks.length > 0) {
            if (editTaskRecursive(task.subtasks, taskId)) {
                return true;
            }
        }
    }
    return false;
}

// Delete task or subtask
function deleteTask(taskId) {
    deleteTaskRecursive(tasks, taskId);
    saveData();
    renderTasks();
    updateCharts();
}

// Recursive function to delete task
function deleteTaskRecursive(taskList, taskId) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === taskId) {
            taskList.splice(i, 1);
            return true;
        }
        if (taskList[i].subtasks && taskList[i].subtasks.length > 0) {
            if (deleteTaskRecursive(taskList[i].subtasks, taskId)) {
                return true;
            }
        }
    }
    return false;
}
// Recursive function to render task list
function renderTaskList(taskList, level = 0) {
    return taskList.map(task => `
        <li class="task-item ${task.priority} ${task.completed ? 'completed' : ''}" style="margin-left: ${level * 20}px;">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleCompletion(${task.id})">
            <span>${task.text}</span>
            ${level === 0 ? `<span class="tag">${task.tag}</span>
            <span class="due-date">${task.dueDate}</span>` : ''}
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="addSubtask(${task.id})">Add Subtask</button>
            ${level === 0 ? `
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${calculateProgressBarWidth(task)}%; background-color: ${getProgressBarColor(task)}"></div>
                <span class="progress-percentage">${calculateProgressBarWidth(task)}%</span>
            </div>` : ''}
            ${task.subtasks && task.subtasks.length > 0 ? `
                <ul class="subtasks">
                    ${renderTaskList(task.subtasks, level + 1)}
                </ul>
            ` : ''}
        </li>
    `).join('');
}

// Calculate progress bar width
function calculateProgressBarWidth(task) {
    const [completed, total] = countCompletedTasks(task);
    return total > 0 ? (completed / total) * 100 : 0;
}

// Recursive function to count completed tasks
function countCompletedTasks(task) {
    let completed = task.completed ? 1 : 0;
    let total = 1;

    if (task.subtasks && task.subtasks.length > 0) {
        for (let subtask of task.subtasks) {
            const [subCompleted, subTotal] = countCompletedTasks(subtask);
            completed += subCompleted;
            total += subTotal;
        }
    }

    return [completed, total];
}
// Switch between personal and school tabs
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(tabElement => tabElement.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');
    updateTagSelect();
    renderTasks();
    renderTagList();
    updateCharts();
}

// Save data to local storage
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tags', JSON.stringify(tags));
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('userName', userName);
}

// Load data from local storage
function loadData() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tags = JSON.parse(localStorage.getItem('tags')) || { personal: ['Personal'], school: ['School'] };
    books = JSON.parse(localStorage.getItem('books')) || [];
    userName = localStorage.getItem('userName') || '';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
// Add a new task
function addTask() {
    const taskText = document.getElementById('taskInput').value.trim();
    const tag = document.getElementById('tagSelect').value;
    const priority = document.getElementById('prioritySelect').value;
    const dueDate = document.getElementById('dueDateInput').value;

    if (taskText) {
        const newTask = {
            id: Date.now(), // Unique identifier for each task
            text: taskText,
            completed: false,
            tag: tag,
            priority: priority,
            dueDate: dueDate,
            subtasks: [],
            tab: currentTab
        };
        tasks.push(newTask);
        document.getElementById('taskInput').value = '';
        saveData();
        renderTasks();
        updateCharts();
    }
}

// Toggle task completion
function toggleTaskCompletion(taskIndex) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveData();
    renderTasks();
    updateCharts();
}
// Toggle subtask completion
function toggleSubtaskCompletion(parentTaskIndex, subtaskIndex, level = 0) {
    let taskList = tasks;
    
    // Traverse to the correct parent subtask if necessary
    for (let i = 0; i < level; i++) {
        taskList = taskList[parentTaskIndex].subtasks;
    }
    
    if (taskList && taskList[parentTaskIndex] && taskList[parentTaskIndex].subtasks[subtaskIndex]) {
        let subtask = taskList[parentTaskIndex].subtasks[subtaskIndex];
        subtask.completed = !subtask.completed;
        saveData();
        renderTasks();
    } else {
        console.error('Error: Subtask not found');
    }
}

// Edit a subtask
function editSubtask(taskIndex, subtaskIndex) {
    const newText = prompt("Edit subtask:", tasks[taskIndex].subtasks[subtaskIndex].text);
    if (newText) {
        tasks[taskIndex].subtasks[subtaskIndex].text = newText;
        saveData();
        renderTasks();
    }
}

function deleteSubtask(parentTaskIndex, subtaskIndex, level = 0) {
    let taskList = tasks;
    
    // Traverse to the correct parent subtask if necessary
    for (let i = 0; i < level; i++) {
        taskList = taskList[parentTaskIndex].subtasks;
    }
    
    if (taskList && taskList[parentTaskIndex] && taskList[parentTaskIndex].subtasks[subtaskIndex]) {
        taskList[parentTaskIndex].subtasks.splice(subtaskIndex, 1);
        saveData();
        renderTasks();
    } else {
        console.error('Error: Subtask not found');
    }
}


// Update the renderTasks function to use task.id
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks
        .filter(task => task.tab === currentTab)
        .map(task => renderTaskItem(task, 0))
        .join('');
}
// Function to render a single task item
function renderTaskItem(task, level) {
    return `
        <li class="task-item ${task.priority} ${task.completed ? 'completed' : ''}" style="margin-left: ${level * 20}px;">
            <div class="task-content">
                <i id="dropdown-${task.id}" class="fas ${task.subtasks && task.subtasks.length > 0 ? 'fa-chevron-down' : 'fa-circle'} dropdown-icon" onclick="toggleSubtasks(${task.id})"><ul id="subtasks-1"> </ul></i>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleCompletion(${task.id})">
                <span>${task.text}</span>
                <span class="tag">${task.tag}</span>
                <span class="due-date">${task.dueDate}</span>
            </div>
            <div class="task-actions">
                <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
                <button onclick="addSubtask(${task.id})"><i class="fas fa-plus"></i></button>
            </div>
<div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${calculateProgressBarWidth(task)}%; background-color: ${getProgressBarColor(task)}"></div>
                    <span class="progress-percentage">${calculateProgressBarWidth(task)}%</span>
                </div>

            ${task.subtasks && task.subtasks.length > 0 ? `
                <ul id="subtasks-${task.id}" class="subtasks" style="display: none;">
                    ${task.subtasks.map(subtask => renderTaskItem(subtask, level + 1)).join('')}
                </ul>
            ` : ''}
        </li>
    `;
}
// Update the renderSubtasks function
function renderSubtasks(subtasks) {
    return subtasks.map(subtask => `
        <li class="subtask-item ${subtask.completed ? 'completed' : ''}">
            <input type="checkbox" ${subtask.completed ? 'checked' : ''} onclick="toggleCompletion(${subtask.id})">
            <span>${subtask.text}</span>
            <button onclick="editTask(${subtask.id})">Edit</button>
            <button onclick="deleteTask(${subtask.id})">Delete</button>
            <button onclick="addSubtask(${subtask.id})">Add Subtask</button>
            ${subtask.subtasks && subtask.subtasks.length > 0 ? `
                <ul>
                    ${renderSubtasks(subtask.subtasks)}
                </ul>
            ` : ''}
        </li>
    `).join('');
}
// Function to toggle subtasks visibility
function toggleSubtasks(taskId) {
  const subtasksList = document.querySelector(`#subtasks-${taskId}`);
  const dropdownIcon = document.querySelector(`#dropdown-${taskId}`);

  if (subtasksList) {
    subtasksList.style.display = isSubtasksOpen === 0 ? 'block' : subtasksList.style.display === 'none' ? 'block' : 'none';
    dropdownIcon.classList.toggle('fa-chevron-down');
    dropdownIcon.classList.toggle('fa-chevron-up');

    // Update flag based on current state
    isSubtasksOpen = isSubtasksOpen === 0 ? 1 : 0;

    // Save the subtask's state to local storage
    localStorage.setItem(`subtaskState-${taskId}`, isSubtasksOpen);

    // Ensure the subtask state is applied to all subtasks (optional)
    // Implement the logic from the previous responses here if needed
  }
}

console.log(tasks);  // Check if subtasks are properly added

function toggleSubtaskVisibility(parentTaskIndex, subtaskIndex, level) {
    const subtasksElement = document.getElementById(`subtasks-${parentTaskIndex}-${subtaskIndex}-${level}`);
    if (subtasksElement) {
        subtasksElement.classList.toggle('hidden');
    } else {
        console.error(`Element with ID subtasks-${parentTaskIndex}-${subtaskIndex}-${level} not found.`);
    }
}





// Calculate progress bar width
function calculateProgressBarWidth(task) {
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = task.subtasks.length;
    return totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
}

// Get progress bar color
function getProgressBarColor(task) {
    const completionPercentage = calculateProgressBarWidth(task);
    if (completionPercentage >= 80) return "#00C851";
    if (completionPercentage >= 50) return "#ffbb33";
    return "#ff4444";
}
// Add a new tag
function addTag() {
    const tag = document.getElementById('tagInput').value.trim();
    if (tag && !tags[currentTab].includes(tag)) {
        tags[currentTab].push(tag);
        document.getElementById('tagInput').value = '';
        saveData();
        renderTagList();
        updateTagSelect();
    }
}

// Edit a tag
function editTag(index) {
    const newTag = prompt("Enter new tag name:", tags[currentTab][index]);
    if (newTag && newTag !== tags[currentTab][index]) {
        const oldTag = tags[currentTab][index];
        tags[currentTab][index] = newTag;
        // Update tasks with the new tag
        tasks.forEach(task => {
            if (task.tag === oldTag && task.tab === currentTab) {
                task.tag = newTag;
            }
        });
        saveData();
        renderTagList();
        updateTagSelect();
        renderTasks();
    }
}

// Delete a tag
function deleteTag(index) {
    const tagToDelete = tags[currentTab][index];
    if (confirm(`Are you sure you want to delete the tag "${tagToDelete}"?`)) {
        tags[currentTab].splice(index, 1);
        // Remove the tag from tasks
        tasks.forEach(task => {
            if (task.tag === tagToDelete && task.tab === currentTab) {
                task.tag = '';
            }
        });
        saveData();
        renderTagList();
        updateTagSelect();
        renderTasks();
    }
}

// Render tag list
function renderTagList() {
    const tagList = document.getElementById('tagList');
    tagList.innerHTML = tags[currentTab].map((tag, index) => `
        <span class="tag-list-item">
            ${tag}
            <button onclick="editTag(${index})">Edit</button>
            <button onclick="deleteTag(${index})">Delete</button>
        </span>
    `).join('');
}

// Update tag select dropdown
function updateTagSelect() {
    const select = document.getElementById('tagSelect');
    select.innerHTML = tags[currentTab].map(tag => `
        <option value="${tag}">${tag}</option>
    `).join('');
}

// Update charts
function updateCharts() {
    updatePriorityChart();
    updateTagChart();
}

// Update priority chart
function updatePriorityChart() {
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    tasks.filter(task => task.tab === currentTab).forEach(task => {
        priorityCounts[task.priority]++;
    });

    const ctx = document.getElementById('priorityChart').getContext('2d');
    
    if (priorityChart) {
        priorityChart.destroy();
    }

    priorityChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
                data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
                backgroundColor: ['#48bb78', '#ed8936', '#f56565']
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Task Priority Distribution'
            }
        }
    });
}

// Update tag chart
function updateTagChart() {
    const tagCounts = {};
    tasks.filter(task => task.tab === currentTab).forEach(task => {
        tagCounts[task.tag] = (tagCounts[task.tag] || 0) + 1;
    });

    const ctx = document.getElementById('tagChart').getContext('2d');
    
    if (tagChart) {
        tagChart.destroy();
    }

    tagChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(tagCounts),
            datasets: [{
                label: 'Number of Tasks',
                data: Object.values(tagCounts),
                backgroundColor: '#4299e1'
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Tasks by Tag'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
}

// Toggle dialog visibility
function toggleDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.classList.toggle('show');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

        // Initialize the application
        document.addEventListener('DOMContentLoaded', init);
    </script>
