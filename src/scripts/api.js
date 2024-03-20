const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-14',
  headers: {
    authorization: '7d44fa7e-04ef-41d7-b07e-efc6bd06cf53',
    'Content-Type': 'application/json',
  }
}

//Метод обработки ответа сервера//
export const processingServerResponse = (res) => {
  if(res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

//Функция инициализации карточек с сервера//
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(processingServerResponse);     
};

//Функция добавления новой карточки на сервер//
export const postNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
    method: 'POST', 
    body: JSON.stringify({
      name, 
      link
    })
  })
    .then(processingServerResponse); 
};

//Функция удаления карточки с сервера/
export const deleteCard = (id) => {
  return fetch(`${config.baseUrl}/cards/${id}`, {
    headers: config.headers,
    method: 'DELETE', 
  })
    .then(processingServerResponse); 
};

//Функция получения данных пользователя с сервера//
export const getUserData = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(processingServerResponse);  
};

//Функция отправки данных пользователя на сервер//
export const sendUserData = (username, description) => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers, 
    method: 'PATCH', 
    body: JSON.stringify({
      name: username, 
      about: description
    })
  }) 
    .then(processingServerResponse); 
};

//Функция отправки данных о новом аватаре на сервер//
export const sendAvatarData = (src) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    headers: config.headers, 
    method: 'PATCH',
    body: JSON.stringify({
      avatar: src
    })
  })
    .then(processingServerResponse); 
};

//Функция отправки лайка на сервер//
export const putCardLike = (id) => {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    headers: config.headers, 
    method: 'PUT',
  })
  .then(processingServerResponse); 
};

//Функция удаления лайка с сервера//
export const deleteCardLike = (id) => {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    headers: config.headers, 
    method: 'DELETE',
  })
  .then(processingServerResponse); 
};
