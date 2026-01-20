let overlay = null;
let submitHandler = null;

export function initModal() {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.className = "modal-overlay hidden";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <input
          id="modalTitleInput"
          class="modal-title-input"
          placeholder="제목을 입력하세요"
        />
        <button class="modal-close" type="button" aria-label="닫기">✕</button>
      </div>

      <div class="modal-body">
        <textarea
          id="modalBodyInput"
          class="modal-body-input"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <div class="modal-footer" id="modalFooter">
        <div class="modal-footer-left">
          <label class="modal-radio">
            <input type="radio" name="status" value="todo" checked />
            <span>To Do</span>
          </label>

          <label class="modal-radio">
            <input type="radio" name="status" value="doing" />
            <span>Doing</span>
          </label>

          <label class="modal-radio">
            <input type="radio" name="status" value="done" />
            <span>Done</span>
          </label>
        </div>

        <div class="modal-footer-right">
          <button class="modal-btn" id="cancelAdd" type="button">취소</button>
          <button class="modal-btn primary" id="confirmAdd" type="button">추가</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // ✅ 이벤트 위임: 어떤 상황에서도 닫기/추가가 동작하게
  overlay.addEventListener("click", (e) => {
    // 배경 클릭 닫기
    if (e.target === overlay) {
      closeModal();
      return;
    }

    // X 버튼 닫기
    if (e.target.closest(".modal-close")) {
      closeModal();
      return;
    }

    // 취소 버튼 닫기
    if (e.target.closest("#cancelAdd")) {
      closeModal();
      return;
    }

    // 추가 버튼
    if (e.target.closest("#confirmAdd")) {
      const titleInput = overlay.querySelector("#modalTitleInput");
      const bodyInput = overlay.querySelector("#modalBodyInput");
      const statusEl = overlay.querySelector('input[name="status"]:checked');
      const status = statusEl ? statusEl.value : "todo";

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      if (!title) return alert("제목은 필수야!");

      if (typeof submitHandler === "function") {
        submitHandler({ title, body, status });
      }

      closeModal();
    }
  });

  // ESC 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

export function openModal({ title = "", body = "", status = "todo", onSubmit } = {}) {
  initModal();

  const titleInput = overlay.querySelector("#modalTitleInput");
  const bodyInput = overlay.querySelector("#modalBodyInput");

  // 새 모달로 초기화 + 값 세팅
  titleInput.value = title;
  bodyInput.value = body;

  const radio = overlay.querySelector(`input[name="status"][value="${status}"]`);
  if (radio) radio.checked = true;

  submitHandler = typeof onSubmit === "function" ? onSubmit : null;

  overlay.classList.remove("hidden"); // 보이게
  document.body.style.overflow = "hidden";
  titleInput.focus();
}

export function closeModal() {
  console.log("closeModal called", overlay);

  if (!overlay) return;

  overlay.classList.add("hidden"); // 안 보이게
  
  console.log("after add hidden:", overlay.className);
  console.log("computed display:", getComputedStyle(overlay).display);

  document.body.style.overflow = "";

  // 모달 값 초기화
  const titleInput = overlay.querySelector("#modalTitleInput");
  const bodyInput = overlay.querySelector("#modalBodyInput");
  if (titleInput) titleInput.value = "";
  if (bodyInput) bodyInput.value = "";

  const todoRadio = overlay.querySelector('input[name="status"][value="todo"]');
  if (todoRadio) todoRadio.checked = true;

  submitHandler = null;
}
