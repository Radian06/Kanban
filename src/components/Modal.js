let overlay = null;

export function initModal() {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.className = "modal-overlay hidden";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 class="modal-title" id="modalTitle"></h2>
        <button class="modal-close" type="button" aria-label="닫기">✕</button>
      </div>

      <div class="modal-body" id="modalBody"></div>

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

  overlay.querySelector("#modalTitle").textContent = title;
  overlay.querySelector("#modalBody").innerHTML = body;
  overlay.querySelector("#modalFooter").innerHTML = footer;

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  if (typeof onOpen === "function") onOpen(overlay);
}

export function closeModal() {
  if (!overlay) return;
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}
