import { state, moveTask } from "../state/store.js";
import { renderTaskCard } from "./TaskCard.js";

function getInsertIndex(laneEl, clientY) {
  // lane 안의 카드들 기준으로 "어디에 끼워 넣을지" 계산
  const cards = Array.from(laneEl.querySelectorAll(".task-card"));

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (clientY < midY) return i; // i번째 카드 '위'로 삽입
  }
  return cards.length; // 맨 아래로
}

export function renderColumn(status, label) {
  const column = document.createElement("section");
  column.className = "kanban-column";
  column.dataset.status = status;

  const header = document.createElement("div");
  header.className = "kanban-column__title";
  header.textContent = label;

  const list = document.createElement("div");
  list.className = "kanban-column__list";

  // drop zone
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const insertIndex = getInsertIndex(list, e.clientY);
    moveTask(taskId, status, insertIndex);
  });

  // order 기준 렌더
  state.tasks
    .filter(t => t.status === status)
    .sort((a, b) => a.order - b.order)
    .forEach(t => {
      list.appendChild(renderTaskCard(t));
    });

  column.appendChild(header);
  column.appendChild(list);
  return column;
}