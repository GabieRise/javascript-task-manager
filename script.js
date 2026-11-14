
/* ==========================================
   TASKFLOW - COMPLETE TASK MANAGER
========================================== */


/* ==========================================
   1. SELECT HTML ELEMENTS
========================================== */

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskPriority = document.querySelector("#task-priority");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedButton = document.querySelector("#clear-completed");


/* ==========================================
   2. LOCAL STORAGE
========================================== */

const STORAGE_KEY = "taskflow-tasks";


function loadTasks() {

    try {

        const savedTasks = localStorage.getItem(STORAGE_KEY);

        const parsedTasks = savedTasks
            ? JSON.parse(savedTasks)
            : [];

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks
            .filter(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            )
            .map(task => ({
                ...task,
                priority: ["high", "medium", "low"].includes(task.priority)
                    ? task.priority
                    : "medium"
            }));

    } catch (error) {

        console.error("Error loading tasks:", error);

        return [];

    }

}


let tasks = loadTasks();

let currentFilter = "all";


function saveTasks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error("Error saving tasks:", error);

    }

}


/* ==========================================
   3. UPDATE TASK COUNTER
========================================== */   
/* =========================
   UPDATE DASHBOARD COUNTS
========================= */


/* =========================
   UPDATE TASK DASHBOARD
   AND COMPLETION PROGRESS
========================= */

function updateTaskCount() {

    // Calculate task totals

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    const activeTasks = tasks.filter(
        task => !task.completed
    ).length;

    const highPriorityTasks = tasks.filter(
        task => task.priority === "high"
    ).length;


    // Calculate completion percentage

    const progressPercentage = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);


    // Update task counter

    taskCount.textContent =
        `${totalTasks} ${totalTasks === 1 ? "task" : "tasks"}`;


    // Update dashboard statistics

    document.querySelector("#total-count").textContent =
        totalTasks;

    document.querySelector("#active-count").textContent =
        activeTasks;

    document.querySelector("#completed-count").textContent =
        completedTasks;

    document.querySelector("#high-priority-count").textContent =
        highPriorityTasks;


    // Update progress percentage

    document.querySelector("#progress-percentage").textContent =
        `${progressPercentage}%`;


    // Update progress bar width

    document.querySelector("#progress-fill").style.width =
        `${progressPercentage}%`;


    // Update accessibility value

    document.querySelector("#progress-track").setAttribute(
        "aria-valuenow",
        progressPercentage
    );


    // Update progress description

    document.querySelector("#progress-summary").textContent =
        `${completedTasks} of ${totalTasks} tasks completed`;

}



/* ==========================================
   4. RENDER TASKS
========================================== */

function renderTasks() {

    taskList.replaceChildren();


    // Filter tasks

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });


    // Display tasks

    filteredTasks.forEach(task => {

        const taskItem = document.createElement("li");

        taskItem.classList.add("task-item");


        if (task.completed) {
            taskItem.classList.add("completed");
        }


        // Checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("task-checkbox");

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );


        // Task text

        const taskTextElement = document.createElement("span");

        taskTextElement.classList.add("task-text");

        taskTextElement.textContent = task.text;


        // Priority badge

        const priorityBadge = document.createElement("span");

        priorityBadge.classList.add(
            "priority-badge",
            `priority-${task.priority}`
        );

        priorityBadge.textContent =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);


        // Task actions container

        const taskActions = document.createElement("div");

        taskActions.classList.add("task-actions");


        // Edit button

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.classList.add("edit-btn");

        editButton.textContent = "Edit";


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add("delete-btn");

        deleteButton.textContent = "Delete";


        /* =================================
           5. COMPLETE TASK
        ================================= */

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });


        /* =================================
           6. EDIT TASK
        ================================= */

        editButton.addEventListener("click", () => {

            const updatedTask = prompt(
                "Edit your task:",
                task.text
            );

            // Stop if user cancels
            if (updatedTask === null) {
                return;
            }

            const cleanTask = updatedTask.trim();

            // Prevent empty task
            if (cleanTask === "") {

                alert("Task cannot be empty.");

                return;

            }

            // Update task
            task.text = cleanTask;

            saveTasks();

            renderTasks();

        });


        /* =================================
           7. DELETE TASK
        ================================= */

        deleteButton.addEventListener("click", () => {

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();

            renderTasks();

        });


        /* =================================
           8. APPEND ELEMENTS
        ================================= */

        taskActions.appendChild(editButton);

        taskActions.appendChild(deleteButton);

        taskItem.appendChild(checkbox);

        taskItem.appendChild(taskTextElement);

        taskItem.appendChild(priorityBadge);

        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);

    });


    /* =================================
       9. EMPTY MESSAGE
    ================================= */

    emptyMessage.hidden = filteredTasks.length > 0;

    if (tasks.length === 0) {

        emptyMessage.textContent =
            "No tasks yet. Add your first task!";

    } else if (filteredTasks.length === 0) {

        emptyMessage.textContent =
            currentFilter === "active"
                ? "No active tasks right now."
                : "No completed tasks yet.";

    }


    /* =================================
       10. UPDATE COUNTER
    ================================= */

    updateTaskCount();


    /* =================================
       11. CLEAR COMPLETED BUTTON
    ================================= */

    if (clearCompletedButton) {

        clearCompletedButton.disabled =
            !tasks.some(task => task.completed);

    }


    /* =================================
       12. UPDATE FILTER BUTTONS
    ================================= */

    filterButtons.forEach(button => {

        const isActive =
            button.dataset.filter === currentFilter;

        button.classList.toggle("active", isActive);

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );

    });

}


/* ==========================================
   13. ADD NEW TASKS
========================================== */

if (
    taskForm &&
    taskInput &&
    taskPriority &&
    taskList &&
    taskCount &&
    emptyMessage
) {

    taskForm.addEventListener("submit", event => {

        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (taskText === "") {

            taskInput.focus();

            return;

        }


        // Create new task

        const newTask = {

            id: window.crypto?.randomUUID
                ? window.crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

            text: taskText,

            completed: false,

            priority: taskPriority.value

        };


        tasks.push(newTask);

        saveTasks();

        renderTasks();


        // Clear form

        taskForm.reset();

        taskInput.focus();

    });


    /* =================================
       14. TASK FILTERING
    ================================= */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentFilter = button.dataset.filter;

            renderTasks();

        });

    });


    /* =================================
       15. CLEAR COMPLETED TASKS
    ================================= */

    if (clearCompletedButton) {

        clearCompletedButton.addEventListener("click", () => {

            const hasCompletedTasks =
                tasks.some(task => task.completed);

            if (!hasCompletedTasks) {
                return;
            }

            const confirmed = confirm(
                "Are you sure you want to remove all completed tasks?"
            );

            if (!confirmed) {
                return;
            }

            tasks = tasks.filter(task => !task.completed);

            saveTasks();

            renderTasks();

        });

    }


    /* =================================
       16. INITIALISE APPLICATION
    ================================= */

    renderTasks();

} else {

    console.error(
        "TaskFlow could not initialise. Check your HTML element IDs."
    );

}
