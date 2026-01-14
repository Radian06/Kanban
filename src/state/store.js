// src/state/store.js
export const state = {
  tasks: [
    { id: 1, title: "1 UI 만들기", status: "todo", order: 0 },
    { id: 2, title: "2 컬럼 레이아웃", status: "doing", order: 0 },
    { id: 3, title: "3 앤 드롭 조사", status: "doing", order: 1 },
    { id: 4, title: "4 정리", status: "doing", order: 2 },
    { id: 5, title: "5 작성", status: "done", order: 0 },
    { id: 6, title: "6 UI 만들기", status: "todo", order: 0 },
    { id: 7, title: "7 컬럼 레이아웃", status: "doing", order: 0 },
    { id: 8, title: "8 앤 드롭 조사", status: "doing", order: 1 },
    { id: 9, title: "9 정리", status: "doing", order: 2 },
    { id: 10, title: "10 작성", status: "done", order: 0 },
  ],
};

function normalizeGroup(status, lane) {
  const group = state.tasks
    .filter(
      (t) =>
        t.status === status && (status !== "doing" || (t.lane ?? 0) === lane)
    )
    .sort((a, b) => a.order - b.order);

  group.forEach((t, i) => (t.order = i));
}

/**
 * ✅ moveTask(taskId, newStatus, insertIndex, newLane?)
 * - todo/done: newLane 무시
 * - doing: newLane 필수(0~2). 없으면 기존 lane 유지(없으면 0)
 */
export function moveTask(taskId, newStatus, insertIndex, newLane) {
  const task = state.tasks.find((t) => String(t.id) === String(taskId));
  if (!task) return;

  const prevStatus = task.status;
  const prevLane = task.lane ?? 0;

  // 새 상태의 lane 결정
  const nextLane =
    newStatus === "doing"
      ? typeof newLane === "number"
        ? newLane
        : task.lane ?? 0
      : 0;

  // 기존 그룹 정규화(제거 효과)
  normalizeGroup(prevStatus, prevLane);

  // 새 그룹 만들기(자기 제외)
  const newGroup = state.tasks
    .filter((t) => {
      if (t.id === task.id) return false;
      if (t.status !== newStatus) return false;
      if (newStatus === "doing") return (t.lane ?? 0) === nextLane;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const safeIndex = Math.max(0, Math.min(newGroup.length, insertIndex));

  // task 속성 업데이트
  task.status = newStatus;
  if (newStatus === "doing") task.lane = nextLane;
  else delete task.lane;

  // 원하는 위치에 끼워넣고 order 재부여
  newGroup.splice(safeIndex, 0, task);
  newGroup.forEach((t, i) => (t.order = i));

  // 이전 그룹도 다시 정리
  normalizeGroup(prevStatus, prevLane);

  document.dispatchEvent(new Event("kanban:change"));
}
