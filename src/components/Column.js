// src/components/Column.js
import { state, moveTask } from "../state/store.js";
import { renderTaskCard } from "./TaskCard.js";

function getInsertIndex(listEl, clientY) {
  const cards = Array.from(listEl.querySelectorAll(".task-card"));

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (clientY < midY) return i;
  }
  return cards.length;
}

function attachDrop(listEl, status, lane) {
  listEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    listEl.classList.add("drag-over");
  });

  listEl.addEventListener("dragleave", () => {
    listEl.classList.remove("drag-over");
  });

  listEl.addEventListener("drop", (e) => {
    e.preventDefault();
    listEl.classList.remove("drag-over");

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const insertIndex = getInsertIndex(listEl, e.clientY);

    // ✅ doing이면 lane 전달, 아니면 lane 없이
    if (status === "doing") moveTask(taskId, "doing", insertIndex, lane);
    else moveTask(taskId, status, insertIndex);
  });
}

export function renderColumn(status, label) {
  const column = document.createElement("section");
  column.className = "kanban-column";
  column.dataset.status = status;

  const header = document.createElement("div");
  header.className = "kanban-column__title";
  header.textContent = label;

  column.appendChild(header);

  // ✅ TODO / DONE: 기존 1개 list
  if (status !== "doing") {
    const list = document.createElement("div");
    list.className = "kanban-column__list";

    attachDrop(list, status);

    state.tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order)
      .forEach((t) => list.appendChild(renderTaskCard(t)));

    column.appendChild(list);
    return column;
  }

  // ✅ DOING: doingBox + list 3개
  const doingBox = document.createElement("div");
  doingBox.className = "kanban-column__doingBox";

  const lists = Array.from({ length: 3 }, (_, lane) => {
    const list = document.createElement("div");
    list.className = "kanban-column__list";
    list.dataset.lane = String(lane);

    attachDrop(list, "doing", lane);

    doingBox.appendChild(list);
    return list;
  });

  state.tasks
    .filter((t) => t.status === "doing")
    .sort((a, b) => {
      const la = a.lane ?? 0;
      const lb = b.lane ?? 0;
      if (la !== lb) return la - lb;
      return a.order - b.order;
    })
    .forEach((t) => {
      const lane = Math.max(0, Math.min(2, t.lane ?? 0));
      lists[lane].appendChild(renderTaskCard(t));
    });

  column.appendChild(doingBox);
  return column;
}
