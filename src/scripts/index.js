import '../pages/index.css';
import { addNewCard, enterCard, removeCard } from './card.js';
import { openedPopup, closeModal } from './modal.js';
import { enableValidation, claerValidate, validationConfig } from './validation.js';
import { getInitialCards, getUserData, sendAvatarData, sendUserData } from './api.js';

//Объявление переменных секции профиля//
const profileName = document.querySelector('.profile__name');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__avatar');
const btnProfileAvatarEdit = document.querySelector('.profile__avatar-edit');
const btnProfileEditor = document.querySelector('.profile__editor');
const btnAddCard = document.querySelector('.profile__add-mesto');
//Объявление переменной секции карточек//
export const cards = document.querySelector('.cards');
//Объявление переменных редактирования профиля//
const profilePopup = document.querySelector('#profile__popup');
const formElementProfile = profilePopup.querySelector('.popup__form');
const nameInput = document.querySelector('#username-input');
const jobInput = document.querySelector('#description-input');
//Объявление переменных добавления карточки//
export const cardsPopup = document.querySelector('#cards-popup');
const formElementCard = cardsPopup.querySelector('.popup__form');
export const placeNameInput = document.querySelector('#place-name-input');
export const placeImageInput = document.querySelector('#place-image-input');
//Объявление переменных для увеличения изображения по клику//
export const imagePopup = document.querySelector('#image-popup');
export const imagePhoto = imagePopup.querySelector('.popup__image');
export const popupDescription = imagePopup.querySelector('.popup__description');
//Объявление переменных удаления карточки//
export const deleteCardPopup = document.querySelector('#delete-card');
const formDeleteCard = deleteCardPopup.querySelector('.popup__form');
//Объявление переменных обновления аватара//
const avatarPopup = document.querySelector('#avatar-popup');
const formElementAvatar = avatarPopup.querySelector('.popup__form');
const avatarInput = document.querySelector('#avatar-input');
//Объявление общих переменных//
const btnsPopupClose = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');
//Объявление переменной клонирования елемента//
export const cardsTemplate = document.querySelector('#card-template');
//Переменная для хранения ID пользователя//
export let userId;

//Слушатель для редактирования аватара//
btnProfileAvatarEdit.addEventListener('click', () => { 
  openedPopup(avatarPopup);
  claerValidate(formElementAvatar, validationConfig);
  enableValidation(formElementAvatar, validationConfig);
});

//Слушатель для внесение информации в профиль//
btnProfileEditor.addEventListener('click', () => { 
  openedPopup(profilePopup);
  claerValidate(formElementProfile, validationConfig);
  enableValidation(formElementProfile, validationConfig);
  setFormDefault();
});

//Слушатель для добавления новой карточки//
btnAddCard.addEventListener('click', () => { 
  openedPopup(cardsPopup);
  claerValidate(formElementCard, validationConfig);
  enableValidation(formElementCard, validationConfig);
});

//Закрытие модальных окон по кнопке//
btnsPopupClose.forEach((button, i) => {
  button.addEventListener('click', () => {
    closeModal(popups[i]);
  }); 
});

//Обработчик для добавления новой карточки//
formElementCard.addEventListener('submit', addNewCard);
//Обработчик для редактирования профиля//
formElementProfile.addEventListener('submit', editProfile);
//Обработчик смены аватара//
formElementAvatar.addEventListener('submit', editAvatar);
//Обработчик удаления карточки//
formDeleteCard.addEventListener('submit', removeCard); 

//Общий промис, срабатывающий при положительном результате обоих запросов//
Promise.all([getUserData(), getInitialCards()])
  .then(([userProfileData, cardOdj]) => {
    setUserInfo(userProfileData);
    userId = userProfileData._id;
    const cardList = Array.from(cardOdj).reverse();
    cardList.forEach(enterCard);    
  })
  .catch((err) => {
    console.log(`Возникла глобальная ошибка, ${err}`);  
  }); 

//Функция для вставки данных профиля//
function setUserInfo (obj) {
  profileName.textContent = obj.name;
  profileDescription.textContent = obj.about;
  profileAvatar.src = obj.avatar;
};

//Функция редактирования профиля страницы//
function editProfile(e) {
  e.preventDefault();
  const button = e.submitter;
  renderingLoading(true, button);

  sendUserData(nameInput.value, jobInput.value)
   .then((newData) => {
     profileName.textContent = newData.name;
     profileDescription.textContent = newData.about;
     e.target.reset(); 
     closeModal(profilePopup);
   })
   .catch((err) => {
    console.log(`При редактировании профиля возникла ошибка, ${err}`);
   })
   .finally(() => {
    renderingLoading(false, button);
   })
};

//Функция передачи данных из профиля в попап//
function setFormDefault() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
};

//Функция редактирования аватара страницы//
function editAvatar(e) {
  e.preventDefault();
  const button = e.submitter;
  renderingLoading(true, button);
  sendAvatarData(avatarInput.value)
    .then((newData) => {
      profileAvatar.src = newData.avatar;
      e.target.reset();
      closeModal(avatarPopup); 
    })
    .catch((err) => {
      console.log(`При обновлении аватара возникла ошибка, ${err}`)
    })
    .finally(() => {
      renderingLoading(false, button);
    })
};

//Загрузка рендеринга//
export function renderingLoading(isLoading, button) {
  if(isLoading) {
    button.textContent = 'Сохранение...';
    button.setAttribute('disabled', '');
    return;
  }
  button.textContent = 'Сохранить'; 
  button.classList.add(validationConfig.disabledBtnClass);
  button.removeAttribute('disabled', '');
};