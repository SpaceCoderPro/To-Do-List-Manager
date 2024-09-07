let tasks = [];
        let username = '';
        let tags = ['work', 'personal', 'urgent', 'longterm'];

        function initApp() {
            loadData();
            if (!username) {
                username = prompt("Welcome! Please enter your name:");
                localStorage.setItem('username', username);
            }
            updateGreeting();
            renderTasks();
            updateCharts();
            setupEventListeners();
        }

        function updateGreeting() {
            document.getElementById('greeting').textContent = `Hi, ${username}! Let's get things done.`;
        }

        function loadData() {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                tasks = JSON.parse(storedTasks);
            }
            username = localStorage.getItem('username') || '';
            const storedTags = localStorage.getItem('tags');
            if (storedTags) {
                tags = JSON.parse(storedTags);
            }
            updateTagDropdown();
        }

        function saveData() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('tags', JSON.stringify(tags));
        }

        function updateTagDropdown() {
            const tagSelect = document.getElementById('taskTags');
            tagSelect.innerHTML = '';
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagSelect.appendChild(option);
            });
        }

        function addTask() {
            const name = document.getElementById('taskName').value;
            const priority = document.getElementById('taskPriority').value;
            const dueDate = document.getElementById('taskDueDate').value;
            const selectedTags = Array.from(document.getElementById('taskTags').selectedOptions).map(option => option.value);

            if (name) {
                const newTask = {
                    id: Date.now(),
                    name,
                    priority,
                    dueDate,
                    tags: selectedTags,
                    completed: false,
                    category: document.querySelector('.custom-tab.active').dataset.tab
                };
                tasks.push(newTask);
                saveData();
                renderTasks();
                updateCharts();
                clearForm();
            }
        }

        function renderTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            const activeTab = document.querySelector('.custom-tab.active').dataset.tab;
            const filteredTasks = tasks.filter(task => task.category === activeTab);

            filteredTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }

        function createTaskElement(task) {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', `${task.priority}-priority`);
            taskElement.innerHTML = `
                <h3 class="text-lg font-semibold">${task.name}</h3>
                <p class="text-sm text-gray-400 mb-2">Due: ${task.dueDate}</p>
                <div class="flex flex-wrap gap-2 mb-2">
                    ${task.tags.map(tag => `<span class="px-2 py-1 bg-blue-600 text-white rounded-full text-sm">${tag}</span>`).join('')}
                </div>
                <div class="mt-2">
                    <button class="edit-task-btn px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">Edit</button>
                    <button class="delete-task-btn px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Delete</button>
                    <button class="toggle-complete-btn px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                </div>
            `;

            const editBtn = taskElement.querySelector('.edit-task-btn');
            editBtn.addEventListener('click', () => editTask(task));

            const deleteBtn = taskElement.querySelector('.delete-task-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            const toggleCompleteBtn = taskElement.querySelector('.toggle-complete-btn');
            toggleCompleteBtn.addEventListener('click', () => toggleTaskComplete(task));

            return taskElement;
        }

        function editTask(task) {
            const newName = prompt('Enter new task name:', task.name);
            if (newName) {
                task.name = newName;
                saveData();
                renderTasks();
                updateCharts();
            }
        }

        function deleteTask(taskId) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveData();
            renderTasks();
            updateCharts();
        }

        function toggleTaskComplete(task) {
            task.completed = !task.completed;
            saveData();
            renderTasks();
            updateCharts();
        }

        function clearForm() {
            document.getElementById('taskName').value = '';
            document.getElementById('taskPriority').value = 'low';
            document.getElementById('taskDueDate').value = '';
            document.getElementById('taskTags').selectedIndex = -1;
        }

        function updateCharts() {
            updatePriorityChart();
            updateTagChart();
        }

        function updatePriorityChart() {
            const priorityCounts = {
                low: tasks.filter(task => task.priority === 'low').length,
                medium: tasks.filter(task => task.priority === 'medium').length,
                high: tasks.filter(task => task.priority === 'high').length
            };

            const ctx = document.getElementById('priorityChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Low', 'Medium', 'High'],
                    datasets: [{
                        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
                        backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tasks by Priority',
                            color: '#fff'
                        },
                        legend: {
                            labels: {
                                color: '#fff'
                            }
                        }
                    }
                }
            });
        }

        function updateTagChart() {
            const tagCounts = {};
            tags.forEach(tag => {
                tagCounts[tag] = tasks.filter(task => task.tags.includes(tag)).length;
            });

            const ctx = document.getElementById('tagChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(tagCounts),
                    datasets: [{
                        label: 'Tasks per Tag',
                        data: Object.values(tagCounts),
                        backgroundColor: '#3B82F6'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tasks by Tag',
                            color: '#fff'
                        },
                        legend: {
                            labels: {
                                color: '#fff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#fff' }
                        },
                        y: {
                            ticks: { color: '#fff' }
                        }
                    }
                }
            });
        }

        function setupEventListeners() {
            document.getElementById('addTaskBtn').addEventListener('click', addTask);
            document.getElementById('clearCompletedBtn').addEventListener('click', clearCompletedTasks);
            document.getElementById('exportDataBtn').addEventListener('click', exportData);
            document.getElementById('addTabBtn').addEventListener('click', addNewTab);
            document.getElementById('newTag').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addNewTag();
                }
            });
            document.querySelectorAll('.custom-tab').forEach(tab => {
                tab.addEventListener('click', () => switchTab(tab.dataset.tab));
            });
        }

        function clearCompletedTasks() {
            tasks = tasks.filter(task => !task.completed);
            saveData();
            renderTasks();
            updateCharts();
        }

        function exportData() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "tasks.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        function addNewTab() {
            const tabName = prompt("Enter new tab name:");
            if (tabName) {
                const tabList = document.getElementById('tabList');
                const newTab = document.createElement('button');
                newTab.classList.add('custom-tab');
                newTab.dataset.tab = tabName.toLowerCase();
                newTab.textContent =
