

const todoForm = document.querySelector("#todoForm");
const taskInput = document.querySelector("#taskInput");
const errorMessage = document.querySelector("#errorMessage");
const taskList = document.querySelector("#taskList");
const taskCounter = document.querySelector("#taskCounter");
const emptyMessage = document.querySelector("#emptyMessage");
const clearCompletedButton = document.querySelector("#clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

// Load saved tasks or start with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// The default filter shows all tasks
let currentFilter = "all";



// JSON.stringify
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Validate input field contents for empty and invalid content, such as content that is too short.
function validateInput(taskText) {
    errorMessage.textContent = "";
    taskInput.classList.remove("input-error");

    if (taskText === "") {
        errorMessage.textContent = "Please enter a task.";
        taskInput.classList.add("input-error");
        return false;
    }

    if (taskText.length < 3) {
        errorMessage.textContent =
            "The task must contain at least 3 characters.";

        taskInput.classList.add("input-error");
        return false;
    }

    if (taskText.length > 80) {
        errorMessage.textContent =
            "The task cannot contain more than 80 characters.";

        taskInput.classList.add("input-error");
        return false;
    }

    return true;
}


function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed === false;
        });
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed === true;
        });
    }

    filteredTasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        taskContent.append(checkbox, taskText);
        listItem.append(taskContent, deleteButton);
        taskList.append(listItem);
    });

    updateTaskInformation(filteredTasks);
}


// Count for the number of open tasks and display messages based on the current filter and task status.
function updateTaskInformation(filteredTasks) {
    const openTasks = tasks.filter(function (task) {
        return task.completed === false;
    });

    taskCounter.textContent = openTasks.length;

    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove("hidden");

        if (currentFilter === "active" && tasks.length > 0) {
            emptyMessage.textContent = "There are no active tasks.";
        } else if (
            currentFilter === "completed" &&
            tasks.length > 0
        ) {
            emptyMessage.textContent = "There are no completed tasks.";
        } else {
            emptyMessage.textContent =
                "No tasks yet. Add your first task!";
        }
    } else {
        emptyMessage.classList.add("hidden");
    }

    const hasCompletedTasks = tasks.some(function (task) {
        return task.completed === true;
    });

    if (hasCompletedTasks) {
        clearCompletedButton.classList.remove("hidden");
    } else {
        clearCompletedButton.classList.add("hidden");
    }
}
    

// Mark the completed status of a task based on its ID.
function toggleTask(taskId) {
    tasks = tasks.map(function (task) {
        if (task.id === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete/Remove one task based on its ID.

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();
    renderTasks();
}


//Validate and add a new task when the form is submitted.

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (!validateInput(taskText)) {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    todoForm.reset();
    taskInput.focus();
});


//Remove the error style when the user starts correcting the input.

taskInput.addEventListener("input", function () {
    errorMessage.textContent = "";
    taskInput.classList.remove("input-error");
});


//Filter tasks based on the selected filter button and update the active filter button style.

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

        renderTasks();
    });
});


// Delete all completed task.

clearCompletedButton.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return task.completed === false;
    });

    saveTasks();
    renderTasks();
});


renderTasks();