const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__submit',
  inactiveButtonClass: 'popup__submit_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input_type_visible'
}

//Функция добавляющая класс с ошибкой//
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

//Функция удаляющая класс с ошибкой//
const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = '';
};

//Функция сброса валидации форм//
function claerValidate(formElement) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });
  formElement.reset()
};

//Функция проверяющая валидность поля//
function isValid(formElement, inputElement) {
  if(inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  
  if(!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

//Функция неактивного состояния кнопки//
const disableButtun = (buttonElement, validationConfig) => {
  buttonElement.setAttribute('disabled', 'true');
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
};

//Функция активного состояния кнопки//
const enableButtun = (buttonElement, validationConfig) => {
  buttonElement.removeAttribute('disabled');
  buttonElement.classList.remove(validationConfig.inactiveButtonClass);
};

// Функция блокировки кнопки //
const toggleButtonState = (inputList, buttonElement) => {
  if(hasInvalidInput(inputList)) {
    disableButtun(buttonElement, validationConfig);
  } else {
    enableButtun(buttonElement, validationConfig);
  }
};

//Добавление слушателя всем полям формы//
const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  toggleButtonState(inputList, buttonElement);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement)
    });
  });
};

//Функция неверного ввода//
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

//Добавление обработчика всем полям формы//
function enableValidation() {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector)); 
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
    });
    setEventListeners(formElement); 
  });
};

export { enableValidation, claerValidate, validationConfig }; 