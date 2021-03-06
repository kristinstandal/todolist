import "./components/task-list.js"
import "./components/task-box.js"

const baseUrl = "/taskservices/api/services";

const tasklist = document.querySelector('task-list');
const taskbox = document.querySelector('task-box');

// Get all tasks and statuses from server
const tasks = await getAllTasks();

// Get all statuses from database and pass them to taskbox and tasklist (to use in HTML)
const allStatuses = await getAllStatuses();
taskbox.allStatuses = allStatuses;
tasklist.allStatuses = allStatuses;

// Tell tasklist to display tasks
tasklist.showTasks(tasks);

// CALLBACKS
tasklist.addtaskCallback(() => {
    console.log("new task button click");

    taskbox.newtaskCallback( async (task) => {
        if(task.title === "") {
            console.log("Need title input!");
            return;
        }

        console.log(`Added new task: ${task.title}.`);
        const response = await addTask(task.title, task.status);
        const newTask = JSON.parse(response).task;
        tasklist.showTask(newTask);
    })
});

tasklist.changestatusCallback( async(task) => {
    // TODO handle case: if the new status is equal to current status

    if(!window.confirm(`Do you want to change the status of ${task.title} to ${task.newStatus}?`)) return;

    console.log(`status of task ${task.id} changed to ${task.newStatus}.`);
    const response = await updateTaskStatus(task.id, task.newStatus);
    tasklist.updateTask(JSON.parse(response));
});

tasklist.deletetaskCallback( async (task) => {
    if(!window.confirm(`Do you want to delete "${task.title}"?`)) return;
    console.log(`delete task ${task.id}`);
    const response = await deleteMember(task.id);
    const deletedTask = JSON.parse(response);
    tasklist.removeTask(deletedTask.id);
})

// API
async function getAllTasks() {
    try {
        const url = `${baseUrl}/tasklist`;
        const response = await fetch(url, {method: "get"});
        const json = await response.json();

        return json.tasks;
    } catch {
        return [];
    }
}

async function getAllStatuses() {
    try {
        const url = `${baseUrl}/allstatuses`;
        const response = await fetch(url, {method: "get"});
        const json = await response.json();

        return json.allstatuses;
    } catch {
        return [];
    }
}

async function updateTaskStatus(id, status) {
    try {
        const url = `${baseUrl}/task/${id}`;

        const data = {
            "status": `${status}`
        };

        const requestSettings = {
            "method": "PUT",
            "headers": { "Content-Type":"application/json; charset=utf-8"},
            "body": JSON.stringify(data),
            "cache": "no-cache",
            "redirect": "error"
        };

        const response = await fetch(url, requestSettings);
        const object = await response.json();

        console.log(`API: Server response: ${JSON.stringify(object)}`);

        return JSON.stringify(object);
    } catch {
        console.log("Got error retrieving data, updateTaskStatus");
    }
}

async function addTask(title, status) {
    try {
        const url = `${baseUrl}/task`;

        const data = {
            "title": `${title}`,
            "status": `${status}`
        };

        const requestSettings = {
            "method": "POST",
            "headers": { "Content-Type":"application/json; charset=utf-8"},
            "body": JSON.stringify(data),
            "cache": "no-cache",
            "redirect": "error"
        };

        const response = await fetch(url, requestSettings);
        const object = await response.json();

        console.log("Object added to database: ", JSON.stringify(object));
        return JSON.stringify(object);

    } catch {
        console.log("error when adding task to database");
    }
}

async function deleteMember(id) {
    try {
        const url = `${baseUrl}/task/${id}`;

        const response = await fetch(url, {method: "delete"});
        const object = await response.json();

        console.log("Deleted object from database: ", JSON.stringify(object));
        return JSON.stringify(object);

    } catch {
        console.log("error when deleting member");
    }
}