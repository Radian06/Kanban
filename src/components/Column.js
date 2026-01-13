import { state } from "../state/store.js";
import { renderTaskCard } from "./TaskCard.js";

export function renderColumn(status, label) {
  const column = document.createElement("section");
  column.className = "kanban-column";
  column.dataset.status = status;

  const header = document.createElement("div");
  header.className = "kanban-column__title";
  header.textContent = label;

  const list = document.createElement("div");
  list.className = "kanban-column__list";

  state.tasks
    .filter((t) => t.status === status)
    .forEach((t) => list.appendChild(renderTaskCard(t)));

  column.appendChild(header);
  column.appendChild(list);

  return column;
}
