// Select elements from the HTML
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const errorMessage = document.querySelector("#errorMessage");

// Listen for form submission
taskForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get the text entered by the user
    const taskText = taskInput.value.trim();

    // Clear previous error
    errorMessage.textContent = "";
    taskInput.classList.remove("invalid");

    // Check if the task is too short
    if (taskText.length < 3) {

        errorMessage.textContent =
            "Task must contain at least 3 characters.";

        taskInput.classList.add("invalid");

        return;
    }

    // Create a new list element
    const newTask = document.createElement("li");

    // Add the task text
    newTask.textContent = taskText;

    // Add the task to the task list
    taskList.appendChild(newTask);

    // Clear the input after adding a task
    taskInput.value = "";

    // Put the cursor back into the input
    taskInput.focus();
});