import { renderColumn } from "../components/Column.js";
import { createClock } from "../components/Clock.js";
import { openModal, initModal } from "../components/Modal.js";
import { state, addTask, updateTask } from "../state/store.js";

export function renderKanbanPage() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // title
  const title = document.createElement("div");
  title.className = "layout-title";
  title.textContent = "Kanban Board";

  // nav
  const nav = document.createElement("div");
  nav.className = "layout-nav";

  // clock
  const timeSlot = document.createElement("div");
  timeSlot.className = "layout-subtitle";

  const clock = createClock({ mode: "datetime" });
  clock.start();
  timeSlot.appendChild(clock.el);

  // subtitle
  const subtitle = document.createElement("div");
  subtitle.className = "layout-subtitle";
  subtitle.textContent = "작업 프로세스 시각화";

  const addBtn = document.createElement("div");
  addBtn.className = "layout-subtitle";
  addBtn.textContent = "할 일 추가";

  // 모달 열기 (추가)
  addBtn.addEventListener("click", () => {
    openModal({
      title: "",
      body: "",
      status: "todo",
      onSubmit: ({ title, body, status }) => {
        addTask({ title, body, status });
      },
    });
  });

  nav.appendChild(timeSlot);
  nav.appendChild(subtitle);
  nav.appendChild(addBtn);

  // board
  const board = document.createElement("div");
  board.className = "kanban-board";
  board.appendChild(renderColumn("todo", "To Do"));
  board.appendChild(renderColumn("doing", "Doing"));
  board.appendChild(renderColumn("done", "Done"));

  // 카드 클릭 시 모달 열기
  board.addEventListener("click", (e) => {
    const card = e.target.closest(".task-card");
    if (!card) return;

    const taskId = card.dataset.taskId;
    if (!taskId) return;

    const task = state.tasks.find((t) => String(t.id) === String(taskId));
    if (!task) return;

    openModal({
      title: task.title ?? "",
      body: task.body ?? "",
      status: task.status ?? "todo",
      onSubmit: ({ title, body, status }) => {
        updateTask(taskId, { title, body, status });
      },
    });
  });

  app.appendChild(title);
  app.appendChild(nav);
  app.appendChild(board);
}

// 중복 렌더링 방지
let subscribed = false;

export function initKanbanPage() {
  // 모달 DOM 1회 생성
  initModal();

  renderKanbanPage();

  if (!subscribed) {
    document.addEventListener("kanban:change", () => {
      renderKanbanPage();
    });
    subscribed = true;
  }
}
