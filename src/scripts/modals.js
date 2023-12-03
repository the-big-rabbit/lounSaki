// modal.js
export function initModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId), {
        // keyboard: false,
        // backdrop: "static",
    });
    return modal;
}
