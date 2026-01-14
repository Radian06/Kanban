export function renderTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;

  card.dataset.taskId = String(task.id);
  card.textContent = task.title;

  /**
   * 드래그 시작 시 taskId 전달
   */
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", String(task.id));
    e.dataTransfer.effectAllowed = "move";
  })

  card.textContent = task.title;
  return card;
}