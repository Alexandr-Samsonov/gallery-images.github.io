(function() {

  var container = document.querySelector('.images__list');
  var loadedImages = []; // изначальный список картинок (массив объектов)
  var btnAddImage = document.querySelector('.page-header__add-image');
  var popupAddImage = document.querySelector('.popup-add-image');
  var bodyTag = document.querySelector('body');

  getImages();

  btnAddImage.addEventListener('click', function(evt) {
    evt.preventDefault();
    popupAddImage.classList.remove('popup-add-image--hidden');
    bodyTag.classList.add('body-noscroll');

    window.addEventListener('click', onOverLayClick);
    window.addEventListener('keydown', onEscClick);
  });

  function onOverLayClick(evt) {
    if (evt.target == popupAddImage) {
      closePopup();
    }
  };

  function onEscClick(evt) {
    if (evt.keyCode == 27) {
      closePopup();
    }
  };

  function closePopup() {
    popupAddImage.classList.add('popup-add-image--hidden');
    bodyTag.classList.remove('body-noscroll');

    window.removeEventListener('click', onOverLayClick);
    window.removeEventListener('keydown', onEscClick);
  };

  function renderImages(imageElement) {
    var fragment = document.createDocumentFragment(); // Создаем фрагмент для экономии памяти

    imageElement.map(function(image, i) {
      var imgPreview = new ImagePreview();
      imgPreview.setData(image, i);
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
    });
    container.appendChild(fragment);
  }

  function getImages() {
    var data = new ImagesBase();
    loadedImages = data.getServerData();
    
    if (loadedImages == 'empty') {
      return;
    } else {
      data.setServerData(loadedImages);
      console.log(loadedImages);
      loadedImages = loadedImages.map(function(image) {
        return new ImagesData(image);
      });
    }
    
    console.log(loadedImages);
    renderImages(loadedImages); // Обработка загруженных данных (отрисовка)
  }

})();