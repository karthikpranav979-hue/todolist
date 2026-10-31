
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


generateTasksButton.addEventListener("click", function() {
    const goal = aiTaskInput.value.trim().toLowerCase();

    if (goal === "") {
        alert("Please describe your goal.");
        return;
    }

    let tasks = [];

    if (goal.includes("dsa") || goal.includes("data structure") || goal.includes("algorithm")) {
        tasks = [
            "Revise arrays and strings",
            "Practice two pointer problems",
            "Learn sliding window technique",
            "Practice binary search problems",
            "Solve linked list problems",
            "Study stacks and queues",
            "Learn trees and binary search trees",
            "Practice graph algorithms",
            "Solve dynamic programming problems",
            "Revise important DSA concepts"
        ];
    } 
    else if (goal.includes("interview") || goal.includes("job")) {
        tasks = [
            "Prepare your self introduction",
            "Revise data structures and algorithms",
            "Practice coding interview questions",
            "Study object oriented programming",
            "Revise DBMS concepts",
            "Practice SQL queries",
            "Learn operating system fundamentals",
            "Prepare your project explanations",
            "Practice mock interviews",
            "Research the company"
        ];
    } 
    else if (goal.includes("web development") || goal.includes("website") || goal.includes("web developer")) {
        tasks = [
            "Revise HTML fundamentals",
            "Learn CSS layouts and Flexbox",
            "Practice responsive web design",
            "Learn JavaScript fundamentals",
            "Practice DOM manipulation",
            "Understand JavaScript events",
            "Learn promises and async/await",
            "Build a small project",
            "Learn Git and GitHub",
            "Deploy your project"
        ];
    } 
    else if (goal.includes("python") || goal.includes("programming") || goal.includes("coding")) {
        tasks = [
            "Learn variables and data types",
            "Practice conditional statements",
            "Learn loops",
            "Understand functions",
            "Practice arrays and strings",
            "Learn object-oriented programming",
            "Solve beginner coding problems",
            "Build a mini project"
        ];
    } 
    else if (goal.includes("fitness") || goal.includes("weight") || goal.includes("exercise")) {
        tasks = [
            "Set a realistic fitness goal",
            "Plan your daily workout",
            "Start with a warm-up",
            "Practice basic strength exercises",
            "Include daily walking",
            "Plan balanced meals",
            "Drink enough water",
            "Track your daily progress"
        ];
    } 
    else if (goal.includes("exam") || goal.includes("study") || goal.includes("learn")) {
        tasks = [
            "List all the topics to study",
            "Divide topics into smaller sections",
            "Study the first topic",
            "Make short notes",
            "Practice important questions",
            "Revise previously studied topics",
            "Take a practice test",
            "Review your mistakes"
        ];
    } 
    else {
        tasks = [
            "Define your main goal clearly",
            "Research the steps required",
            "Divide the goal into smaller tasks",
            "Complete the first task",
            "Track your daily progress",
            "Review what you have completed",
            "Identify areas for improvement",
            "Complete the remaining tasks"
        ];
    }

    aiSuggestions.innerHTML = "";

    tasks.forEach(function(task) {
        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.textContent = task;

        const addButton = document.createElement("button");
        addButton.textContent = "Add to My Tasks";
        addButton.type = "button";
        addButton.classList.add("button", "ai-add-button");

        addButton.addEventListener("click", function() {
            todosCount++;

            const newTodo = {
                text: task,
                uniqueNo: todosCount,
                isChecked: false
            };

            todoList.push(newTodo);
            createAndAppendTodo(newTodo);
            saveTodos();

            addButton.textContent = "Added";
            addButton.disabled = true;
        });

        li.appendChild(taskText);
        li.appendChild(addButton);

        aiSuggestions.appendChild(li);
    });
});
