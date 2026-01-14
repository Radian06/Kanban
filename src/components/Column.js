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

// dropEl: 실제 드롭/스크롤 되는 영역
// boxEl: 테두리(드래그 오버 표시) 붙일 박스(기본 dropEl)
function attachDrop(dropEl, status, lane, boxEl = dropEl) {
  dropEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    boxEl.classList.add("drag-over");
  });

  dropEl.addEventListener("dragleave", () => {
    boxEl.classList.remove("drag-over");
  });

  dropEl.addEventListener("drop", (e) => {
    e.preventDefault();
    boxEl.classList.remove("drag-over");

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const insertIndex = getInsertIndex(dropEl, e.clientY);

    // doing이면 lane 전달, 아니면 lane 없이
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

  // TODO / DONE
  if (status !== "doing") {
    const list = document.createElement("div");
    list.className = "kanban-column__list";

    // 카드만 스크롤되는 영역(패딩은 list가 유지)
    const scrollArea = document.createElement("div");
    scrollArea.className = "kanban-column__scrollArea";

    attachDrop(scrollArea, status, undefined, list);

    state.tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order)
      .forEach((t) => scrollArea.appendChild(renderTaskCard(t)));

    list.appendChild(scrollArea);
    column.appendChild(list);
    return column;
  }

  // DOING
  const doingBox = document.createElement("div");
  doingBox.className = "kanban-column__doingBox";

  const lists = Array.from({ length: 3 }, (_, lane) => {
    const list = document.createElement("div");
    list.className = "kanban-column__list";
    list.dataset.lane = String(lane);

    // 카드만 스크롤되는 영역(패딩은 list가 유지)
    const scrollArea = document.createElement("div");
    scrollArea.className = "kanban-column__scrollArea";

    attachDrop(scrollArea, "doing", lane, list);

    list.appendChild(scrollArea);
    doingBox.appendChild(list);

    return { list, scrollArea };
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
      lists[lane].scrollArea.appendChild(renderTaskCard(t));
    });

  column.appendChild(doingBox);
  return column;
}
