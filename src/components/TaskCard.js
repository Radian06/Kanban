export function renderTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.taskId = String(task.id);
  card.textContent = task.title;
  return card;
}
