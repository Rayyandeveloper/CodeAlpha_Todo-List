const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const progress = document.getElementById("progress");
const clearCompleted = document.getElementById("clearCompleted");

const filters = document.querySelectorAll(".filter");

let currentFilter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(){

  const text = taskInput.value.trim();

  if(text === ""){
    alert("Please enter a task");
    return;
  }

  tasks.push({
    text: text,
    completed: false
  });

  saveTasks();

  taskInput.value = "";

  renderTasks();

}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e)=>{

  if(e.key === "Enter"){
    addTask();
  }

});

function renderTasks(){

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if(currentFilter === "pending"){
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if(currentFilter === "completed"){
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task)=>{

    const realIndex = tasks.indexOf(task);

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    taskDiv.innerHTML = `
    
      <div class="task-left">

        <div class="check ${task.completed ? "completed" : ""}">
          ${task.completed ? '<i class="fa-solid fa-check"></i>' : ""}
        </div>

        <p class="task-text ${task.completed ? "done" : ""}">
          ${task.text}
        </p>

      </div>

      <div class="task-actions">

        <button class="action-btn edit">
          <i class="fa-solid fa-pen"></i>
        </button>

        <button class="action-btn delete">
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    
    `;

    taskDiv.querySelector(".check").addEventListener("click",()=>{

      tasks[realIndex].completed = !tasks[realIndex].completed;

      saveTasks();
      renderTasks();

    });

    taskDiv.querySelector(".edit").addEventListener("click",()=>{

      const newTask = prompt("Edit Task", task.text);

      if(newTask && newTask.trim() !== ""){

        tasks[realIndex].text = newTask;

        saveTasks();
        renderTasks();

      }

    });

    taskDiv.querySelector(".delete").addEventListener("click",()=>{

      tasks.splice(realIndex, 1);

      saveTasks();
      renderTasks();

    });

    taskList.appendChild(taskDiv);

  });

  updateStats();

}

function updateStats(){

  const total = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  taskCount.innerText = `${total} Tasks`;

  completedCount.innerText = completed;

  const percent = total === 0 ? 0 : (completed / total) * 100;

  progress.style.width = `${percent}%`;

}

clearCompleted.addEventListener("click",()=>{

  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();

});


filters.forEach(button => {

  button.addEventListener("click",()=>{

    filters.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const text = button.innerText.toLowerCase();

    currentFilter = text;

    renderTasks();

  });

});

renderTasks();