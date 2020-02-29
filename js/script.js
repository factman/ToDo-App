/*
 * MIT License
 *
 * Copyright (c) 2020.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Closure
(() => {
    'use strict';

    /**
     * HTML, CSS, & JavaScript Based To Do Application.
     * @package ToDoApp
     * @author Mohammed Odunayo <factman60@gmail.com>
     * @copyright 2020
     * @license MIT
     * @version v1.0.0
     * @kind class
     */
    class ToDoApp {

        /**
         * Class constructor, the entry point.
         */
        constructor() {
            this.toDoList = this.loadData();
            this.storageName = 'ToDo-List';
            this.listContainer = document.getElementById('list_container');

            this.addButton = document.getElementById('add_button');
            this.addButton.setAttribute('disabled', 'disabled');
            this.addButton.addEventListener('click', this.createTask.bind(this));

            this.titleInput = document.getElementById('todo_title');
            this.titleInput.addEventListener('keyup', this.validateForm.bind(this));

            this.descInput = document.getElementById('todo_desc');
            this.descInput.addEventListener('keyup', this.validateForm.bind(this));

            this.exportButton = document.getElementById('export');
            this.exportButton.addEventListener('click', this.exportData.bind(this));

            this.displayList();
        }

        /**
         * Load data from the localStorage.
         * @returns {Array} Array of tasks.
         */
        loadData() {
            const data = localStorage.getItem(this.storageName);

            return data ? JSON.parse(data) : [];
        }

        /**
         * Save data to the localStorage.
         * @returns {void}
         */
        saveData() {
            const data = JSON.stringify(this.toDoList);
            localStorage.setItem(this.storageName, data);
        }

        /**
         * Add a new task to the list of tasks.
         * @returns {void}
         */
        createTask() {
            const task = {
                completed: false,
                createdAt: new Date(),
                description: this.descInput.value.trim(),
                title: this.titleInput.value.trim()
            };

            this.toDoList.splice(0, 0, task);
            this.titleInput.value = '';
            this.descInput.value = '';
            this.validateForm();
            this.displayList();
        }

        /**
         * Validate the input form and control the status of the submit button.
         * @returns {void}
         */
        validateForm() {
            const title = this.titleInput.value.trim();
            const desc = this.descInput.value.trim();

            if (title.length < 2 || desc.length < 6) {
                this.addButton.setAttribute('disabled', 'disabled');
            } else {
                this.addButton.removeAttribute('disabled');
            }
        }

        /**
         * Download the task list as a JSON file.
         * @returns {void}
         */
        exportData() {
            if (this.toDoList.length > 0) {
                const data = JSON.stringify(this.toDoList, null, 4);
                const blob = new Blob([data], {type: 'application/json'});
                const url = webkitURL || URL;
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

        /**
         * Change the status of a task to completed.
         * @param {number} index Task Index
         * @returns {void}
         */
        completeTask(index) {
            this.toDoList[index].completed = true;
            this.displayList();
        }

        /**
         * Remove a task from the list.
         * @param {number} index Task Index
         * @returns {void}
         */
        removeTask(index) {
            const option = confirm('Click Ok To Remove This Task.');

            if (option) {
                this.toDoList.splice(index, 1);
                this.displayList();
            }
        }

        /**
         * Generate a task component and append it to the display container.
         * @param {object} task Task object
         * @param {number} index Task index
         * @returns {void}
         */
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

        /**
         * Render the tasks to the display screen.
         * @returns {void}
         */
        displayList() {
            this.listContainer.innerHTML = '';
            this.toDoList.forEach(this.appendTask.bind(this));
            this.saveData();
        }
    }

    // Instantiating the ToDoApp class object.
    new ToDoApp();
})();
