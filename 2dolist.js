
const todoItemsContainer = document.getElementById("todoItemsContainer");
const addTodoButton = document.getElementById("addTodoButton");
const saveTodoButton = document.getElementById("saveTodoButton");
const todoUserInput = document.getElementById("todoUserInput");

const generateTasksButton = document.getElementById("generateTasksButton");
const aiTaskInput = document.getElementById("aiTaskInput");
const aiSuggestions = document.getElementById("aiSuggestions");
const aiLoading = document.getElementById("aiLoading");

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

function saveTodos() {
    try {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    } catch (error) {
        console.error(error);
        alert("Unable to save tasks.");
    }
}

let todoList = getTodoListFromLocalStorage();

let todosCount = todoList.reduce(function(maxId, todo) {
    return Math.max(maxId, todo.uniqueNo);
}, 0);

function onAddTodo() {
    const userInputValue = todoUserInput.value.trim();

    if (userInputValue === "") {
        alert("Please enter a valid task.");
        return;
    }

    todosCount++;

    const newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };

    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    saveTodos();

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

const AI_API_URL = "";

generateTasksButton.addEventListener("click", async function() {
    const goal = aiTaskInput.value.trim();

    if (goal === "") {
        alert("Please describe your goal.");
        return;
    }

    if (AI_API_URL === "") {
        alert("AI backend is not connected yet.");
        return;
    }

    aiLoading.hidden = false;
    generateTasksButton.disabled = true;
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

        if (!response.ok) {
            throw new Error("AI server returned an error.");
        }

        const data = await response.json();

        if (!Array.isArray(data.tasks)) {
            throw new Error("Invalid AI response.");
        }

        if (data.tasks.length === 0) {
            throw new Error("No tasks generated.");
        }

        data.tasks.forEach(function(task) {
            if (typeof task !== "string" || task.trim() === "") {
                return;
            }

            const li = document.createElement("li");

            const taskText = document.createElement("span");
            taskText.textContent = task.trim();

            li.appendChild(taskText);

            const addButton = document.createElement("button");

            addButton.textContent = "Add to My Tasks";
            addButton.type = "button";
            addButton.classList.add("button", "ai-add-button");

            addButton.addEventListener("click", function() {
                todosCount++;

                const newTodo = {
                    text: task.trim(),
                    uniqueNo: todosCount,
                    isChecked: false
                };

                todoList.push(newTodo);
                createAndAppendTodo(newTodo);
                saveTodos();

                addButton.disabled = true;
                addButton.textContent = "Added";
            });

            li.appendChild(addButton);
            aiSuggestions.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        alert("Unable to generate tasks. Please try again.");
    } finally {
        aiLoading.hidden = true;
        generateTasksButton.disabled = false;
    }
});
