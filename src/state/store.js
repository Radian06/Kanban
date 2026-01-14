export const state = {
  tasks: [
    { id: 1, title: "로그인 UI 만들기", status: "todo" },
    { id: 2, title: "칸반 컬럼 레이아웃", status: "doing" },
    { id: 3, title: "드래그 앤 드롭 조사", status: "doing" },
    { id: 4, title: "CSS 정리", status: "doing" },
    { id: 5, title: "README 작성", status: "done" },
    { id: 6, title: "로그인 UI 만들기", status: "todo" },
    { id: 7, title: "칸반 컬럼 레이아웃", status: "doing" },
    { id: 8, title: "드래그 앤 드롭 조사", status: "doing" },
    { id: 9, title: "CSS 정리", status: "doing" },
    { id: 10, title: "README 작성", status: "done" }
  ],
};

/**
 * task 이동 함수
 */
export function moveTask(taskId, newStatus) {
  const id = String(taskId);

  state.tasks = state.tasks.map((t) =>
    String(t.id) === id ? { ...t, status: newStatus } : t
  );

  // 화면 다시 그리기 트리거
  document.dispatchEvent(new Event("kanban:change"));
}