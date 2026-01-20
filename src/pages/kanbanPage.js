import { renderColumn } from "../components/Column.js";
import { createClock } from "../components/Clock.js";
import { openModal, closeModal, initModal } from "../components/Modal.js";

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

  // 모달 열기
  addBtn.addEventListener("click", () => {
    openModal({
      footer: `
        <button class="modal-btn" id="cancelAdd">취소</button>
        <button class="modal-btn primary" id="confirmAdd">추가</button>
      `,
      onOpen: ({ titleInput, bodyInput }) => {
        document
          .getElementById("cancelAdd")
          .addEventListener("click", closeModal);

        document.getElementById("confirmAdd").addEventListener("click", () => {
          const title = titleInput.value.trim();
          const body = bodyInput.value.trim();

          if (!title) return alert("제목은 필수야!");

          // 나중에 여기에 store에 저장
          // addTask({ title, description: body, status: "todo" });

          document.dispatchEvent(new CustomEvent("kanban:change"));
          closeModal();
        });
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
