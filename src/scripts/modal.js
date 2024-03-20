//Открытие модальных окон//
function openedPopup(popupElement) {
  popupElement.classList.add('popup_opened');
  document.addEventListener('keydown', closeModalEsc);
  popupElement.addEventListener('click', closeModalOverlay);
};

//Закрытие модальных окон//
function closeModal(popupElement) {
  popupElement.classList.remove('popup_opened');
  document.removeEventListener('keydown', closeModalEsc);
  popupElement.removeEventListener('click', closeModalOverlay);
};       

//Закрытие модальных окон по Escape//
const closeModalEsc = (e) => {
  const popup = document.querySelector('.popup_opened');
  if(e.key === 'Escape') {
    closeModal(popup);
  }
};

//Закрытие модальных окон по Overlay//
const closeModalOverlay = (e) => {
  if(e.target === e.currentTarget) {
    closeModal(e.currentTarget);
  }
}; 

export { openedPopup, closeModal };



