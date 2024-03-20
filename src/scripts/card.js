import { closeModal, openedPopup } from './modal.js';
import { deleteCardLike, putCardLike, deleteCard, postNewCard } from './api.js';
import { validationConfig } from './validation.js';
import { renderingLoading, 
  userId,
  cardsPopup,
  cards,
  imagePopup, 
  imagePhoto,
  popupDescription, 
  placeNameInput, 
  placeImageInput, 
  cardsTemplate, 
  deleteCardPopup } 
  from './index.js';

let cardItemDelete = null;

//Функция создания карточки//
const createCard = (cardData) => {
  const cardItem = cardsTemplate.content.querySelector('.cards__item').cloneNode(true);
  const elementText = cardItem.querySelector('.cards__description');
  const elementImage = cardItem.querySelector('.cards__image');
  const cardsDelete = cardItem.querySelector('.cards__delete');
  const cardsLikeCounter = cardItem.querySelector('.cards__like-counter');
  const cardsLike = cardItem.querySelector('.cards__like');

  elementText.textContent = cardData.name; 
  elementImage.src = cardData.link;
  elementImage.alt = cardData.name;

  cardItem.id = cardData._id;
  const cardItemId = cardItem.id;
  const likeArea = cardData.likes;

  if(cardData.owner._id !== userId) {
    cardsDelete.remove(); 
  } else {
    cardsDelete.addEventListener('click', (e) => {
      cardItemDelete = e.target.closest('.cards__item');
      openedPopup(deleteCardPopup)
    });
  }
  if(likeArea.length > 0) {
    cardsLikeCounter.textContent = likeArea.length;
  }
  if(likedCard(likeArea, userId)) {
    cardsLike.classList.add('cards__like_active');
  }

  cardsLike.addEventListener('click', () => {
    if(cardsLike.classList.contains('cards__like_active')) {
      hendleDeleteLike(cardsLike, cardItemId, cardsLikeCounter);
      return;
    };
      handleAddLike(cardsLike, cardItemId, cardsLikeCounter);
  });

  handleCardZoom(cardData.name, cardData.link, elementImage);
  return cardItem;
};
  
//Функция увеличения изображения//
function handleCardZoom(name, link, cover) {
  cover.addEventListener('click', () => {
    openedPopup(imagePopup);
    imagePhoto.src = link;
    imagePhoto.alt = name;
    popupDescription.textContent = name;
  })
};

//Функция проверки наличия лайка на карточке//
function likedCard (likeList, userId) {
  return likeList.find((userLike) => {
    userLike._id === userId;
  });
};

//Функция добавления лайка//
function handleAddLike(cardsLike, cardItemId, likeCounter) {
  return putCardLike(cardItemId)
    .then((res) => {
      likeCounter.textContent = res.likes.length;
      cardsLike.classList.add('cards__like_active');
    })
    .catch((err) => {
      console.log(`При лайке карточки возникла ошибка, ${err}`);
    })
};

//Функция удаления лайка//
function hendleDeleteLike(cardsLike, cardItemId, likeCounter) {
  return deleteCardLike(cardItemId) 
    .then((res) => {
      if(res.likes.length === 0) {
        likeCounter.textContent = '';
      } else {
        likeCounter.textContent = res.likes.length;
      }
      cardsLike.classList.remove('cards__like_active');
    })
    .catch((err) => {
      console.log(`При дизлайке карточки возникла ошибка, ${err}`);
    })
};

//функция добавление карточки в начало//
function enterCard(newCard) {
  const elementCard = createCard(newCard);
  cards.prepend(elementCard);
};

//Функция добавления новой карточки//
function addNewCard (e) {
  e.preventDefault();
  
  const button = e.submitter;
  const name = placeNameInput.value;
  const link = placeImageInput.value;

  renderingLoading(true, button);
  postNewCard(name, link)
    .then((newCard) => {
      enterCard(newCard);
      e.target.reset();
      closeModal(cardsPopup);
    })
    .catch((err) => {
      console.log(`При добавлении карточки возникла ошибка, ${err}`);
      e.submitter.classList.add(validationConfig.disableBtnClass);
      button.setAttribute('disabled', '');
    })
    .finally(() => {
      renderingLoading(false, button);
    })
}; 

//Функция удаления карточки//
function removeCard(e) {
  e.preventDefault();
  const button = e.submitter;
  renderingLoading(true, button);
  return deleteCard(cardItemDelete.id)
      .then(() => {
        cardItemDelete.remove();
        closeModal(deleteCardPopup);
      }) 
      .catch((err) => {
        console.log(`При удалении карточки возникла ошибка, ${err}`);
      })
      .finally(() => {
        renderingLoading(false, button);
      })
};

export { addNewCard, enterCard, removeCard };


  