const openFooterModal = document.querySelector('.footer-section__link');
const closeFooterModalBtn = document.querySelector('.footer-modal__btn');
const footerModal = document.querySelector('[data-footerModal]');

function onOpenFooterModalClick(e) {
  e.preventDefault();
  footerModal.classList.remove('is-hidden');
  document.body.classList.add('overflow');
  document.addEventListener('keydown', onEscClose);
  closeFooterModalBtn.addEventListener('click', onCloseFooterModalClick);
  footerModal.addEventListener('click', onBackdropClick);
}

function onCloseFooterModalClick(e) {
  closeModal();
}

function onEscClose(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function closeModal() {
  footerModal.classList.add('is-hidden');
  document.body.classList.remove('overflow');
  footerModal.removeEventListener('click', onBackdropClick);
  document.removeEventListener('keydown', onEscClose);
  closeFooterModalBtn.removeEventListener('click', onCloseFooterModalClick);
}

openFooterModal.addEventListener('click', onOpenFooterModalClick);
