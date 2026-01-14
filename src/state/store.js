// src/state/store.js
export const state = {
  tasks: [
    { id: 1, title: "로그인 UI 만들기", status: "todo", lane: 0, order: 0 },
    { id: 2, title: "칸반 컬럼 레이아웃", status: "doing", lane: 0, order: 0 },
    { id: 3, title: "드래그 앤 드롭 조사", status: "doing", lane: 1, order: 0 },
    { id: 4, title: "CSS 정리", status: "doing", lane: 2, order: 0 },
    { id: 5, title: "README 작성", status: "done", lane: 0, order: 0 },
    { id: 6, title: "로그인 UI 만들기", status: "todo", lane: 1, order: 0 },
    { id: 7, title: "칸반 컬럼 레이아웃", status: "doing", lane: 0, order: 1 },
    { id: 8, title: "드래그 앤 드롭 조사", status: "doing", lane: 1, order: 1 },
    { id: 9, title: "CSS 정리", status: "doing", lane: 2, order: 1 },
    { id: 10, title: "README 작성", status: "done", lane: 0, order: 1 },
  ],
};

function normalizeOrders(status, lane) {
  const group = state.tasks
    .filter((t) => t.status === status && t.lane === lane)
    .sort((a, b) => a.order - b.order);

  group.forEach((t, idx) => {
    t.order = idx;
  });
}

/**
 * task를 (status, lane)의 "원하는 위치(insertIndex)"로 이동
 */
export function moveTask(taskId, newStatus, newLane, insertIndex) {
  const id = String(taskId);
  const task = state.tasks.find((t) => String(t.id) === id);
  if (!task) return;

  const prevStatus = task.status;
  const prevLane = task.lane;

  // 기존 그룹에서 제거
  task.status = newStatus;
  task.lane = newLane;

  // 새 그룹의 정렬된 리스트 만들고, insertIndex 위치에 끼워 넣기
  const newGroup = state.tasks
    .filter((t) => t.status === newStatus && t.lane === newLane && String(t.id) !== id)
    .sort((a, b) => a.order - b.order);

  const safeIndex = Math.max(0, Math.min(newGroup.length, insertIndex));
  newGroup.splice(safeIndex, 0, task);

  // 새 그룹 order 재부여
  newGroup.forEach((t, idx) => {
    t.order = idx;
  });

  // 이전 그룹도 order 재정렬
  normalizeOrders(prevStatus, prevLane);

  // 렌더 트리거
  document.dispatchEvent(new Event("kanban:change"));
}
