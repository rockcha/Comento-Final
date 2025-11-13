const e = require("express");

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");

  const taskList = document.getElementById("task-list");

  const addTask = (event) => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      alert("비어있는 입력값입니다");
      return;
    }

    const li = document.createElement("li");
    li.textContent = taskText;
    taskList.appendChild(li);
    taskInput.value = "";
  };

  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask(e);
    }
  });
});
