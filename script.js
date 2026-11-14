
/* ==========================================
   TASKFLOW - JAVASCRIPT TASK MANAGER
   Features:
   1. Add Tasks
   2. Complete Tasks
   3. Delete Tasks
   4. Filter Tasks
   5. Local Storage
========================================== */


/* ==========================================
   1. SELECT HTML ELEMENTS
========================================== */

const taskForm = document.querySelector("#task-form");

const taskInput = document.querySelector("#task-input");

const taskList = document.querySelector("#task-list");

const taskCount = document.querySelector("#task-count");

const emptyMessage = document.querySelector("#empty-message");

const filterButtons = document.querySelectorAll(".filter-btn");


/* ==========================================
   2. LOCAL STORAGE CONFIGURATION
========================================== */

const STORAGE_KEY = "taskflow-tasks";


/* Load saved tasks */

function loadTasks() {

    try {

        const savedTasks = localStorage.getItem(STORAGE_KEY);

        const parsedTasks = savedTasks
            ? JSON.parse(savedTasks)
            : [];

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );

    } catch (error) {

        console.error("Error loading tasks:", error);

        return [];

    }

}


/* Our main task collection */

let tasks = loadTasks();


/* Current filter selection */

let currentFilter = "all";


/* Save tasks to localStorage */

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

function updateTaskCount() {

    const totalTasks = tasks.length;

    taskCount.textContent =
        `${totalTasks} ${totalTasks === 1 ? "task" : "tasks"}`;

}


/* ==========================================
   4. RENDER TASKS ON THE PAGE
========================================== */

function renderTasks() {

    // Clear the existing task list

    taskList.replaceChildren();


    // Filter tasks according to selection

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {

            return !task.completed;

        }

        if (currentFilter === "completed") {

            return task.completed;

        }

        return true;

    });


    // Display each filtered task

    filteredTasks.forEach(task => {

        // Create task container

        const taskItem = document.createElement("li");

        taskItem.classList.add("task-item");


        // Add completed styling when necessary

        if (task.completed) {

            taskItem.classList.add("completed");

        }


        /* =================================
           5. CREATE CHECKBOX
        ================================= */

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("task-checkbox");

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );


        /* =================================
           6. CREATE TASK TEXT
        ================================= */

        const taskTextElement = document.createElement("span");

        taskTextElement.classList.add("task-text");

        taskTextElement.textContent = task.text;


        /* =================================
           7. CREATE DELETE BUTTON
        ================================= */

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add("delete-btn");

        deleteButton.textContent = "×";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );


        /* =================================
           8. MARK TASK AS COMPLETED
        ================================= */

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            // Save updated task status

            saveTasks();

            // Refresh task display

            renderTasks();

        });


        /* =================================
           9. DELETE TASK
        ================================= */

        deleteButton.addEventListener("click", () => {

            // Remove selected task from collection

            tasks = tasks.filter(item => item.id !== task.id);

            // Save updated collection

            saveTasks();

            // Refresh display

            renderTasks();

        });


        /* =================================
           10. ADD ELEMENTS TO TASK ITEM
        ================================= */

        taskItem.appendChild(checkbox);

        taskItem.appendChild(taskTextElement);

        taskItem.appendChild(deleteButton);


        // Add task item to the page

        taskList.appendChild(taskItem);

    });


    /* =================================
       11. EMPTY MESSAGE
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
       12. UPDATE TASK COUNTER
    ================================= */

    updateTaskCount();


    /* =================================
       13. UPDATE FILTER BUTTONS
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
   14. ADD NEW TASKS
========================================== */

if (taskForm && taskInput && taskList && taskCount && emptyMessage) {

    taskForm.addEventListener("submit", (event) => {

        // Prevent automatic page refresh

        event.preventDefault();


        // Get input and remove unnecessary spaces

        const taskText = taskInput.value.trim();


        // Prevent empty tasks

        if (taskText === "") {

            taskInput.focus();

            return;

        }


        // Create a new task object

        const newTask = {

            id: window.crypto?.randomUUID
                ? window.crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

            text: taskText,

            completed: false

        };


        // Add new task to our collection

        tasks.push(newTask);


        // Save task to localStorage

        saveTasks();


        // Update the webpage

        renderTasks();


        // Clear input field

        taskInput.value = "";

        taskInput.focus();

    });


    /* =================================
       15. FILTER TASKS
    ================================= */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            // Get selected category

            currentFilter = button.dataset.filter;


            // Display matching tasks

            renderTasks();

        });

    });


    /* =================================
       16. INITIALISE APPLICATION
    ================================= */

    renderTasks();

} else {

    console.error(
        "TaskFlow could not initialise. Check your HTML element IDs."
    );

}
