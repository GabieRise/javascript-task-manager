
/* =========================
   1. SELECT HTML ELEMENTS
========================= */

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");


/* =========================
   2. CHECK HTML ELEMENTS
========================= */

if (taskForm && taskInput && taskList && taskCount && emptyMessage) {


    /* =========================
       3. UPDATE TASK COUNTER
    ========================== */

    function updateTaskCount() {

        const totalTasks = taskList.children.length;

        taskCount.textContent =
            `${totalTasks} ${totalTasks === 1 ? "task" : "tasks"}`;

        emptyMessage.hidden = totalTasks > 0;

    }


    /* =========================
       4. CREATE TASK
    ========================== */

    function createTask(taskText) {

        // Create task container
        const taskItem = document.createElement("li");

        taskItem.classList.add("task-item");


        // Create checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.classList.add("task-checkbox");

        checkbox.setAttribute(
            "aria-label",
            `Mark ${taskText} as completed`
        );


        // Create task text
        const taskTextElement = document.createElement("span");

        taskTextElement.classList.add("task-text");

        taskTextElement.textContent = taskText;


        // Create delete button
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add("delete-btn");

        deleteButton.textContent = "×";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${taskText}`
        );


        // Add checkbox, text and button to task
        taskItem.appendChild(checkbox);

        taskItem.appendChild(taskTextElement);

        taskItem.appendChild(deleteButton);


        /* =========================
           5. MARK TASK COMPLETED
        ========================== */

        checkbox.addEventListener("change", () => {

            taskItem.classList.toggle(
                "completed",
                checkbox.checked
            );

        });


        /* =========================
           6. DELETE TASK
        ========================== */

        deleteButton.addEventListener("click", () => {

            taskItem.remove();

            updateTaskCount();

        });


        // Add task to the webpage
        taskList.appendChild(taskItem);

        // Update counter
        updateTaskCount();

    }


    /* =========================
       7. ADD TASK FORM
    ========================== */

    taskForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const taskText = taskInput.value.trim();

        // Prevent empty tasks
        if (taskText === "") {

            taskInput.focus();

            return;

        }

        // Create new task
        createTask(taskText);

        // Clear input
        taskInput.value = "";

        taskInput.focus();

    });


    // Initialise task counter
    updateTaskCount();

}
