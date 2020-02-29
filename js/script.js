"use strict";

class ToDoApp {
    toDoList;
    storageName = 'ToDo-List';
    listContainer = document.getElementById('list_container');
    addButton = document.getElementById('add_button');
    titleInput = document.getElementById('todo_title');
    descInput = document.getElementById('todo_desc');
    exportButton = document.getElementById('export');

    constructor() {
        this.addButton.setAttribute('disabled', 'disabled');
        this.addButton.addEventListener('click', this.createTask.bind(this));
        this.titleInput.addEventListener('keyup', this.validateForm.bind(this));
        this.descInput.addEventListener('keyup', this.validateForm.bind(this));
        this.exportButton.addEventListener('click', this.exportData.bind(this));
        this.toDoList = this.loadData();

        this.displayList();
    }

    loadData() {
        const data = localStorage.getItem(this.storageName);
        return data ? JSON.parse(data) : [];
    }

    saveData() {
        const data = JSON.stringify(this.toDoList);
        localStorage.setItem(this.storageName, data);
    }

    createTask() {
        const task = {
            title: this.titleInput.value.trim(),
            description: this.descInput.value.trim(),
            completed: false,
            createdAt: new Date(),
        };

        this.toDoList.splice(0, 0, task);
        this.titleInput.value = '';
        this.descInput.value = '';
        this.validateForm();
        this.displayList();
    }

    validateForm() {
        const title = this.titleInput.value.trim();
        const desc = this.descInput.value.trim();

        if (title.length < 2 || desc.length < 6) {
            this.addButton.setAttribute('disabled', 'disabled');
        } else {
            this.addButton.removeAttribute('disabled');
        }
    }

    exportData() {
        if (this.toDoList.length > 0) {
            const data = JSON.stringify(this.toDoList, null, 4);
            const blob = new Blob([data], {type: "application/json"});
            const url = URL || webkitURL;
            const downloadLink = url.createObjectURL(blob);
            const downloadButton = document.createElement('a');

            downloadButton.setAttribute('download', `ToDO-Export-Data-${Date.now()}.json`);
            downloadButton.setAttribute('href', downloadLink);
            downloadButton.style.display = 'none';
            document.body.appendChild(downloadButton);
            downloadButton.click();
            url.revokeObjectURL(downloadLink);

        } else {
            alert('Empty List: No Data To Export.');
        }
    }

    completeTask(index) {
        this.toDoList[index].completed = true;
        this.displayList();
    }

    removeTask(index) {
        const option = confirm('Click Ok To Remove This Task.');

        if (option) {
            this.toDoList.splice(index, 1);
            this.displayList();
        }
    }

    appendTask(task, index) {
        const taskElement = document.createElement('div');
        taskElement.setAttribute('class', 'list-item');

        const completedImage = document.createElement('img');
        completedImage.setAttribute('src', './img/Done%20All.png');
        completedImage.setAttribute('class', 'status-icon');
        completedImage.setAttribute('alt', '...');
        completedImage.setAttribute('title', 'Task Completed');

        const pendingImage = document.createElement('img');
        pendingImage.setAttribute('src', './img/Pending.png');
        pendingImage.setAttribute('class', 'status-icon');
        pendingImage.setAttribute('alt', '...');
        pendingImage.setAttribute('title', 'Task In Progress');

        const content = document.createElement('div');
        content.setAttribute('class', 'content');

        const taskTitle = document.createElement('h3');
        taskTitle.innerHTML = task.title;

        const taskDesc = document.createElement('p');
        taskDesc.innerHTML = task.description;

        const taskActions = document.createElement('div');
        taskActions.setAttribute('class', 'action');

        const removeAction = document.createElement('img');
        removeAction.setAttribute('src', './img/Cancel.png');
        removeAction.setAttribute('class', 'action-icon');
        removeAction.setAttribute('alt', '...');
        removeAction.addEventListener('click', this.removeTask.bind(this, index));
        removeAction.setAttribute('title', 'Remove Task');

        const completeAction = document.createElement('img');
        completeAction.setAttribute('src', './img/approve.png');
        completeAction.setAttribute('class', 'action-icon');
        completeAction.setAttribute('alt', '...');
        completeAction.addEventListener('click', this.completeTask.bind(this, index));
        completeAction.setAttribute('title', 'Complete Task');

        if (task.completed) {
            content.appendChild(taskTitle);
            content.appendChild(taskDesc);
            taskActions.appendChild(removeAction);
            taskElement.appendChild(completedImage);
            taskElement.appendChild(content);
            taskElement.appendChild(taskActions);
        } else {
            content.appendChild(taskTitle);
            content.appendChild(taskDesc);
            taskActions.appendChild(completeAction);
            taskActions.appendChild(removeAction);
            taskElement.appendChild(pendingImage);
            taskElement.appendChild(content);
            taskElement.appendChild(taskActions);
        }

        this.listContainer.appendChild(taskElement);
    }

    displayList() {
        this.listContainer.innerHTML = '';
        this.toDoList.forEach(this.appendTask.bind(this));
        this.saveData();
    }
}

new ToDoApp();
