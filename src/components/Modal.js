let overlay = null;

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

      <div class="modal-footer" id="modalFooter"></div>
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
}

export function openModal({ title = "", body = "", footer = "", onOpen } = {}) {
  initModal();

  // input / textarea에 초기값 세팅
  const titleInput = overlay.querySelector("#modalTitleInput");
  const bodyInput = overlay.querySelector("#modalBodyInput");

  titleInput.value = title;
  bodyInput.value = body;

  overlay.querySelector("#modalFooter").innerHTML = footer;

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
