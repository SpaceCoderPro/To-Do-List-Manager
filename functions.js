        let tasks = [];
        let subjects = ['Personal', 'School', 'Work'];
        let currentTab = 'personal';
        let userName = '';

        function init() {
            loadData();
            if (!userName) {
                userName = prompt("Please enter your name:");
                if (userName) {
                    localStorage.setItem('userName', userName);
                }
            }
            updateGreeting();
            updateSubjectSelect();
            renderTasks();
            updateCharts();
        }

        function updateGreeting() {
            document.getElementById('greeting').textContent = `Hi, ${userName}!`;
        }

        function switchTab(tab) {
            currentTab = tab;
            renderTasks();
        }

        function addTask() {
            const taskText = document.getElementById('taskInput').value;
            const subject = document.getElementById('subjectSelect').value;
            const priority = document.getElementById('prioritySelect').value;
            const dueDate = document.getElementById('dueDateInput').value;
            if (taskText) {
                tasks.push({
                    text: taskText,
                    completed: false,
                    subject: subject,
                    priority: priority,
                    dueDate: dueDate,
                    subtasks: [],
                    tab: currentTab
                });
                document.getElementById('taskInput').value = '';
                saveData();
                renderTasks();
                updateCharts();
            }
        }

        function addSubject() {
            const subject = document.getElementById('subjectInput').value;
            if (subject && !subjects.includes(subject)) {
                subjects.push(subject);
                document.getElementById('subjectInput').value = '';
                updateSubjectSelect();
                saveData();
            }
        }

        function updateSubjectSelect() {
            const select = document.getElementById('subjectSelect');
            select.innerHTML = '';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                select.appendChild(option);
            });
        }

        function addSubtask(taskIndex) {
            const subtaskText = prompt("Enter subtask:");
            if (subtaskText) {
                tasks[taskIndex].subtasks.push({ text: subtaskText, completed: false });
                saveData();
                renderTasks();
            }
        }

        function toggleTaskCompletion(taskIndex) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveData();
            renderTasks();
            updateCharts();
        }

        function toggleSubtaskCompletion(taskIndex, subtaskIndex) {
            tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
            saveData();
            renderTasks();
        }

        function deleteTask(taskIndex) {
            tasks.splice(taskIndex, 1);
            saveData();
            renderTasks();
            updateCharts();
        }

        function editTask(taskIndex) {
            const newText = prompt("Edit task:", tasks[taskIndex].text);
            if (newText !== null) {
                tasks[taskIndex].text = newText;
                saveData();
                renderTasks();
            }
        }

        function renderTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.filter(task => task.tab === currentTab).forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${index})">
                    <span class="${task.completed ? 'completed' : ''} priority-${task.priority}">${task.text}</span>
                    <span>(${task.subject})</span>
                    <span>Due: ${task.dueDate}</span>
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                    <button onclick="addSubtask(${index})">Add Subtask</button>
                `;
                const subtaskList = document.createElement('ul');
                task.subtasks.forEach((subtask, subtaskIndex) => {
                    const subtaskLi = document.createElement('li');
                    subtaskLi.className = 'subtask';
                    subtaskLi.innerHTML = `
                        <input type="checkbox" ${subtask.completed ? 'checked' : ''} onchange="toggleSubtaskCompletion(${index}, ${subtaskIndex})">
                        <span class="${subtask.completed ? 'completed' : ''}">${subtask.text}</span>
                    `;
                    subtaskList.appendChild(subtaskLi);
                });
                li.appendChild(subtaskList);
                taskList.appendChild(li);
            });
        }

        function updateCharts() {
            updatePriorityChart();
            updateSubjectChart();
        }

        function updatePriorityChart() {
            const ctx = document.getElementById('priorityChart').getContext('2d');
            const priorityCounts = {
                low: tasks.filter(task => task.priority === 'low').length,
                medium: tasks.filter(task => task.priority === 'medium').length,
                high: tasks.filter(task => task.priority === 'high').length
            };
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Low', 'Medium', 'High'],
                    datasets: [{
                        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
                        backgroundColor: ['#00C851', '#ffbb33', '#ff4444']
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Tasks by Priority'
                    }
                }
            });
        }

        function updateSubjectChart() {
            const ctx = document.getElementById('subjectChart').getContext('2d');
            const subjectCounts = {};
            tasks.forEach(task => {
                subjectCounts[task.subject] = (subjectCounts[task.subject] || 0) + 1;
            });
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(subjectCounts),
                    datasets: [{
                        label: 'Tasks per Subject',
                        data: Object.values(subjectCounts),
                        backgroundColor: '#4CAF50'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        function saveData() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('subjects', JSON.stringify(subjects));
        }

        function loadData() {
            const savedTasks = localStorage.getItem('tasks');
            const savedSubjects = localStorage.getItem('subjects');
            userName = localStorage.getItem('userName');
            if (savedTasks) tasks = JSON.parse(savedTasks);
            if (savedSubjects) subjects = JSON.parse(savedSubjects);
        }

        window.onload = init;
