
/* =========================
   1. TASK MANAGER
========================= */

// Select HTML elements

const taskForm = document.querySelector("#task-form");

const taskInput = document.querySelector("#task-input");

const taskList = document.querySelector("#task-list");

const taskCount = document.querySelector("#task-count");

const emptyMessage = document.querySelector("#empty-message");


// Check that the required elements exist

if (taskForm && taskInput && taskList && taskCount && emptyMessage) {

    // Function to update task count

    function updateTaskCount() {

        const totalTasks = taskList.children.length;

        taskCount.textContent =
            `${totalTasks} ${totalTasks === 1 ? "task" : "tasks"}`;

        // Show or hide empty message

        emptyMessage.hidden = totalTasks > 0;

    }


    // Listen for form submission

    taskForm.addEventListener("submit", (event) => {

        // Prevent page refresh

        event.preventDefault();


        // Get task value and remove unnecessary spaces

        const taskText = taskInput.value.trim();


        // Prevent empty tasks

        if (taskText === "") {

            taskInput.focus();

            return;

        }


        // Create a new list item

        const taskItem = document.createElement("li");

        taskItem.classList.add("task-item");


        // Create a text element

        const taskTextElement = document.createElement("span");

        taskTextElement.classList.add("task-text");

        taskTextElement.textContent = taskText;


        // Add text to the task item

        taskItem.appendChild(taskTextElement);


        // Add task item to the task list

        taskList.appendChild(taskItem);


        // Clear the input field

        taskInput.value = "";


        // Return cursor to input field

        taskInput.focus();


        // Update task counter

        updateTaskCount();

    });


    // Update initial task count

    updateTaskCount();

}
