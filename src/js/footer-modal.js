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
  e.preventDefault();
  footerModal.classList.add('is-hidden');
  document.body.classList.remove('overflow');
}

function onEscClose(e) {
  if (e.key === 'Escape') {
    footerModal.classList.add('is-hidden');
    document.body.classList.remove('overflow');
  }
}

function closeModal() {
  footerModal.classList.add('is-hidden');
  document.body.classList.remove('overflow');
  footerModal.removeEventListener('click', onBackdropClick);
  document.removeEventListener('keydown', onEscClose);
  closeFooterModalBtn.removeEventListener('click', onCloseFooterModalClick);
}

function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

openFooterModal.addEventListener('click', onOpenFooterModalClick);
