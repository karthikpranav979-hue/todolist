
const todoItemsContainer = document.getElementById("todoItemsContainer");
const addTodoButton = document.getElementById("addTodoButton");
const saveTodoButton = document.getElementById("saveTodoButton");
const todoUserInput = document.getElementById("todoUserInput");

const generateTasksButton = document.getElementById("generateTasksButton");
const aiTaskInput = document.getElementById("aiTaskInput");
const aiSuggestions = document.getElementById("aiSuggestions");
const aiLoading = document.getElementById("aiLoading");

const AI_API_URL = "http://localhost:3000/api/breakdown";

function getTodoListFromLocalStorage() {
    try {
        const storedTodoList = localStorage.getItem("todoList");

        if (storedTodoList === null) {
            return [];
        }

        const parsedTodoList = JSON.parse(storedTodoList);

        if (!Array.isArray(parsedTodoList)) {
            return [];
        }

        return parsedTodoList.filter(function(todo) {
            return (
                todo &&
                typeof todo.text === "string" &&
                Number.isInteger(todo.uniqueNo) &&
                typeof todo.isChecked === "boolean"
            );
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

let todoList = getTodoListFromLocalStorage();

let todosCount = todoList.reduce(function(maxId, todo) {
    return Math.max(maxId, todo.uniqueNo);
}, 0);

function saveTodos() {
    try {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    } catch (error) {
        console.error(error);
        alert("Unable to save tasks.");
    }
}

function addTodoToList(taskText) {
    const newTodo = {
        text: taskText,
        uniqueNo: ++todosCount,
        isChecked: false
    };

    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    saveTodos();

    return newTodo;
}

function onAddTodo() {
    const userInputValue = todoUserInput.value.trim();

    if (userInputValue === "") {
        alert("Please enter a valid task.");
        return;
    }

    addTodoToList(userInputValue);
    todoUserInput.value = "";
}

addTodoButton.addEventListener("click", onAddTodo);

todoUserInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        onAddTodo();
    }
});

function onTodoStatusChange(todoId, checkboxElement, labelElement) {
    const todoObject = todoList.find(function(eachTodo) {
        return "todo" + eachTodo.uniqueNo === todoId;
    });

    if (!todoObject) {
        return;
    }

    todoObject.isChecked = checkboxElement.checked;

    labelElement.classList.toggle(
        "checked",
        checkboxElement.checked
    );

    saveTodos();
}

function onDeleteTodo(todoId) {
    const todoElement = document.getElementById(todoId);

    if (!todoElement) {
        return;
    }

    todoItemsContainer.removeChild(todoElement);

    todoList = todoList.filter(function(eachTodo) {
        return "todo" + eachTodo.uniqueNo !== todoId;
    });

    saveTodos();
}

function createAndAppendTodo(todo) {
    const todoId = "todo" + todo.uniqueNo;
    const checkboxId = "checkbox" + todo.uniqueNo;
    const labelId = "label" + todo.uniqueNo;

    const todoElement = document.createElement("li");

    todoElement.classList.add(
        "todo-item-container",
        "d-flex",
        "flex-row"
    );

    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    const inputElement = document.createElement("input");

    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.classList.add("checkbox-input");

    todoElement.appendChild(inputElement);

    const labelContainer = document.createElement("div");

    labelContainer.classList.add(
        "label-container",
        "d-flex",
        "flex-row"
    );

    todoElement.appendChild(labelContainer);

    const labelElement = document.createElement("label");

    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;

    if (todo.isChecked) {
        labelElement.classList.add("checked");
    }

    labelContainer.appendChild(labelElement);

    inputElement.addEventListener("change", function() {
        onTodoStatusChange(todoId, inputElement, labelElement);
    });

    const deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");

    labelContainer.appendChild(deleteIconContainer);

    const deleteIcon = document.createElement("i");

    deleteIcon.classList.add(
        "far",
        "fa-trash-alt",
        "delete-icon"
    );

    deleteIcon.setAttribute("role", "button");
    deleteIcon.setAttribute("tabindex", "0");
    deleteIcon.setAttribute("aria-label", "Delete task");

    deleteIcon.addEventListener("click", function() {
        onDeleteTodo(todoId);
    });

    deleteIcon.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onDeleteTodo(todoId);
        }
    });

    deleteIconContainer.appendChild(deleteIcon);
}

for (const todo of todoList) {
    createAndAppendTodo(todo);
}

saveTodoButton.addEventListener("click", function() {
    saveTodos();
    alert("Tasks saved successfully!");
});

async function generateAITasks() {
    const goal = aiTaskInput.value.trim();

    if (goal === "") {
        alert("Please describe your goal.");
        return;
    }

    generateTasksButton.disabled = true;
    aiLoading.hidden = false;
    aiSuggestions.innerHTML = "";

    try {
        const response = await fetch(AI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                goal: goal
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to generate tasks.");
        }

        if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
            throw new Error("Gemini did not return any tasks.");
        }

        displayAISuggestions(data.tasks);

    } catch (error) {
        console.error("AI Error:", error);
        alert("Unable to generate tasks: " + error.message);
    } finally {
        generateTasksButton.disabled = false;
        aiLoading.hidden = true;
    }
}

function displayAISuggestions(tasks) {
    aiSuggestions.innerHTML = "";

    tasks.forEach(function(task) {
        const taskTextValue = typeof task === "string"
            ? task
            : task.text || task.task;

        if (typeof taskTextValue !== "string" || !taskTextValue.trim()) {
            return;
        }

        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.textContent = taskTextValue;

        const addButton = document.createElement("button");

        addButton.textContent = "Add to My Tasks";
        addButton.type = "button";
        addButton.classList.add("button", "ai-add-button");

        addButton.addEventListener("click", function() {
            addTodoToList(taskTextValue);

            addButton.textContent = "Added";
            addButton.disabled = true;
        });

        li.appendChild(taskText);
        li.appendChild(addButton);

        aiSuggestions.appendChild(li);
    });
}

generateTasksButton.addEventListener("click", generateAITasks);
