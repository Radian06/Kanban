export const state = {
  tasks: [

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
 * TaskCard 이동
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

/**
 * TaskCard 추가
 */
export function addTask({ title, body = "", status = "todo" }) {
  const safeStatus = ["todo", "doing", "done"].includes(status) ? status : "todo";

  // 같은 상태 그룹에서 가장 마지막 order를 찾아 뒤에 붙이기
  const group = state.tasks
    .filter((t) => t.status === safeStatus && (safeStatus !== "doing" || (t.lane ?? 0) === 0))
    .sort((a, b) => a.order - b.order);

  const nextOrder = group.length;

  const newTask = {
    id: Date.now(),
    title,
    body,
    status: safeStatus,
    order: nextOrder,
  };

  // doing일 경우 lane이 필요하면 기본 lane 0 넣기
  if (safeStatus === "doing") newTask.lane = 0;

  state.tasks.push(newTask);

  // 그룹 정렬/정규화
  normalizeGroup(safeStatus, newTask.lane ?? 0);

  // 렌더 트리거
  document.dispatchEvent(new Event("kanban:change"));
}
