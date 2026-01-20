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
          <button class="modal-btn" id="cancelAdd">취소</button>
          <button class="modal-btn primary" id="confirmAdd">추가</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 배경 클릭 닫기
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // X 버튼 닫기
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  // ESC 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // 취소 버튼 닫기
  overlay.querySelector("#cancelAdd").addEventListener("click", closeModal);

  // 추가 버튼 동작
  overlay.querySelector("#confirmAdd").addEventListener("click", () => {
    const titleInput = overlay.querySelector("#modalTitleInput");
    const bodyInput = overlay.querySelector("#modalBodyInput");
    const statusEl = overlay.querySelector('input[name="status"]:checked');
    const status = statusEl ? statusEl.value : "todo";

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) return alert("제목은 필수야!");

    // 외부에서 넘긴 submitHandler가 있으면 호출
    if (typeof submitHandler === "function") {
      submitHandler({ title, body, status });
    }

    closeModal();
  });
}

export function openModal({
  title = "",
  body = "",
  status = "todo",
  footer = null,
  onOpen,
  onSubmit,
} = {}) {
  initModal();

  // input / textarea에 초기값 세팅
  const titleInput = overlay.querySelector("#modalTitleInput");
  const bodyInput = overlay.querySelector("#modalBodyInput");

  titleInput.value = title;
  bodyInput.value = body;

  // 라디오 기본 선택 세팅
  const radio = overlay.querySelector(`input[name="status"][value="${status}"]`);
  if (radio) radio.checked = true;

  // footer가 들어온 경우에만 덮어쓰기 (안 주면 기본 footer 유지)
  if (typeof footer === "string") {
    overlay.querySelector("#modalFooter").innerHTML = footer;
  }

  // submit 콜백 저장
  submitHandler = typeof onSubmit === "function" ? onSubmit : null;

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // 자동 포커스
  titleInput.focus();

  if (typeof onOpen === "function") {
    onOpen({
      overlay,
      titleInput,
      bodyInput,
    });
  }
}

export function closeModal() {
  if (!overlay) return;
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}
