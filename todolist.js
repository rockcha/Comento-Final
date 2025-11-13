// 입력 값과 Todo 리스트 상태
let inputValue = "";
let todolist = [];
const MAX_ITEM = 8;

// DOM 요소 캐싱
const $input = document.querySelector("#todo-input input");
const $addButton = document.getElementById("addTodo-button");
const $todoList = document.getElementById("todo-board");
const $todoMessage = document.getElementById("todo-message");

// 인풋 변경될 때마다 inputValue 업데이트
$input.addEventListener("input", (e) => {
  inputValue = e.target.value;
});

// 버튼 클릭 시 Todo 추가
$addButton.addEventListener("click", addTodo);

// 엔터 키로도 Todo 추가
$input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Todo 아이템 클래스 (상태 + 동작 캡슐화)
class TodoItem {
  constructor(content) {
    this.isDone = false;
    this.content = content;
  }

  toggle() {
    this.isDone = !this.isDone;
  }
}

// Todo 추가 로직
function addTodo() {
  if (inputValue.trim() === "") {
    alert("빈 칸입니다.");
    return;
  }

  if (todolist.length >= MAX_ITEM) {
    alert(`할 일이 ${MAX_ITEM}개를 초과했습니다.`);
    return;
  }

  // 새 Todo 객체 추가
  todolist.push(new TodoItem(inputValue.trim()));

  // 입력값 리셋
  inputValue = "";
  $input.value = "";

  // 메시지 표시
  showMessage("할 일이 추가되었습니다!", "green");

  // 화면 다시 그리기
  render();
}

// 체크박스 클릭 시 완료/미완료 토글
function handleToggleDone(e) {
  const index = e.currentTarget.dataset.index;
  todolist[index].toggle();
  showMessage("할 일이 완료 및 미완료 되었습니다!", "blue");
  render();
}

// 삭제 버튼 클릭 시 Todo 삭제
function handleDelete(e) {
  const index = e.currentTarget.dataset.index;
  todolist.splice(index, 1);

  if (todolist.length === 0) {
    showMessage("메세지가 없습니다.", "gray", false);
  } else {
    showMessage("할 일이 삭제되었습니다.", "#fa5252");
  }

  render();
}

// 메시지 출력 helper
function showMessage(text, color = "gray", autoReset = true) {
  $todoMessage.innerText = text;
  $todoMessage.style.color = color;

  if (autoReset) {
    setTimeout(() => {
      $todoMessage.innerText = "메세지가 없습니다.";
      $todoMessage.style.color = "gray";
    }, 2500);
  }
}

// 화면 렌더링
function render() {
  // 기존 리스트 비우기
  $todoList.innerHTML = ``;

  // 현재 todolist를 기반으로 li 생성
  todolist.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <div class="todo-left">
        <button class="checkbox" data-index="${index}">
          <i class="fa-regular ${
            item.isDone ? "fa-square-check" : "fa-square"
          }"></i>
        </button>
        <div class="todo-content ${item.isDone ? "done" : ""}">
          ${item.content}
        </div>
      </div>
      <button class="delete-button" data-index="${index}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    $todoList.appendChild(li);
  });

  // 새로 그린 요소들에 이벤트 다시 연결
  const checkboxes = document.querySelectorAll(".checkbox");
  const deleteButtons = document.querySelectorAll(".delete-button");

  checkboxes.forEach((btn) => {
    btn.addEventListener("click", handleToggleDone);
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}
