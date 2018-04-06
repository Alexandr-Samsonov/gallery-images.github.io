(function() {
  'use strict';

  var container = document.querySelector('.images__list');
  var bodyTag = document.querySelector('body');
  var form = document.querySelector('.popup-add-image__form');
  if (!form) return; // Если форма не найдена, то завершаем скрипт

  var elements = form.querySelectorAll('.popup-add-image__input');
  var btn = form.querySelector('.popup-add-image__btn');
  var errorMessage = [
    'Введите url картинки',
    'Введите комментарий для картинки'
  ];
  var isError = false;
  var popupImage = document.querySelector('.popup-add-image');

  btn.addEventListener('click', validForm); // Обработчик события запускающий валидацию формы

  // Определение элемента который в фокусе и если этот элемент не кнопка, то убираем выведенное
  // сообщение об ошибке. Событие onfocus можно поймать только
  // на стадии перехвата(погружения), то присваиваем addEventListener третий аргумент true
  form.addEventListener('focus', function() {
    var el = document.activeElement;
    if (el !== btn) cleanError(el);
  }, true);

  function validForm(evt) {
    evt.preventDefault();
    var formVal = getFormData(form);
    var errors = []; // Массив куда сохраняются ошибки
    var error; // Переменная куда сохраняется текст ошибки

    for (var property in formVal) {
      error = getError(formVal, property);
      if (error.length != 0) {
        isError = true; // Устанавливаем флаг ошибки
        showError(property, error); // Отображение текста ошибки
        errors.push(property); // Запись name элемента, который не валиден
      }
    }

    if (errors.length == 0) {
      isError = false;
      btn.disabled = true;
    }

    if (!isError) {
      sendFormData(formVal);
    }

    return false;
  };

  function getError(formVal, property) {
    var error = '';
    var validate = {
      'url': function() {
        if (formVal.url.length == 0) {
          error = errorMessage[0];
        }
      },
      'comment': function() {
        if (formVal.comment.length == 0) {
          error = errorMessage[1];
        }
      }
    };

    validate[property]();
    return error;
  };

  [].forEach.call(elements, function(element) {
    element.addEventListener('blur', function(evt) {
      var formElement = evt.target;
      var property = formElement.getAttribute('name');
      var dataField = {};

      dataField[property] = formElement.value;

      var error = getError(dataField, property);
      if (error.length != 0) {
        showError(property, error);
      }

      return false;
    });
  });

  function showError(property, error) {
    var formElement = form.querySelector('[name=' + property + ']');
    var errorBox = formElement.parentElement.nextElementSibling;

    formElement.classList.add('popup-add-image__input-error');
    errorBox.textContent = error;
    errorBox.style.display = 'block';
  };

  function cleanError(el) {
    var errorBox = el.parentElement.nextElementSibling;

    el.classList.remove('popup-add-image__input-error');
    errorBox.removeAttribute('style');
  };

  function getFormData(form) {
    var controls = {}; // Запись данных в формате 'имя_поля': 'значение'

    if (!form.elements) return '';
    for (var i = 0; i < form.elements.length; i++) {
      var element = form.elements[i];

      if (element.tagName.toLowerCase() !== 'button') {
        controls[element.name] = element.value;
      }
    }

    return controls;
  };

  function renderImages(imageElement) {
    var fragment = document.createDocumentFragment();
    var index = imageElement.length - 1; // Индекс последнего объекта в массиве (нового добавленного объекта)
    var image = imageElement.pop(); // Возвращаем последний объект массива (то есть новый добавленный объект)

    var imgPreview = new ImagePreview();
    imgPreview.setData(image, index);
    imgPreview.render();
    imgPreview.setRenderedElements(imgPreview);
    fragment.appendChild(imgPreview.element);

    // Используем способ колбека. Использование заранее определенных в объекте функций обратного вызова.
    // Аналог DOM Events Level 0 только для компонент.
    var popupImage = new ImagePopup();
    imgPreview.onClick = function() {
      popupImage.setData(imgPreview.getData(), imgPreview.getIndex());
      popupImage.show();
    };

    container.appendChild(fragment);
  };

  function sendFormData(formVal) {
    console.log(formVal);
    var arrFormVal = [];
    arrFormVal.push(formVal);

    var setNewData = new ImagesBase();
    setNewData.addServerData(arrFormVal);
    console.log(arrFormVal);

    popupImage.classList.add('popup-add-image--hidden');
    btn.disabled = false;
    bodyTag.classList.remove('body-noscroll');

    var allArrFormVal = setNewData.getServerData();
    console.log(allArrFormVal); 
    allArrFormVal = allArrFormVal.map(function(image) {
      return new ImagesData(image);
    });

    console.log(allArrFormVal);
    renderImages(allArrFormVal);
  };

})();