(function() {

  var bodyTag = document.querySelector('body');
  var container = document.querySelector('.images__list');
  var editButton = document.querySelector('.popup-image__button-edit');
  var renderedElements = [];
  var context;
  var wrapper = document.querySelector('.popup-image__edit-comment');
  var textaerea = wrapper.querySelector('.popup-image__commentfield');
  var textaereaError = wrapper.querySelector('.popup-image__commentfield-nosave');

  function ImagePopup() {
    this.element = document.querySelector('.popup-image');
    // Фиксируем контекст в конструкторе
    this._onOverlayClick = this._onOverlayClick.bind(this);
    this._onEscClick = this._onEscClick.bind(this);
  };

  ImagePopup.prototype = new ImagesBase();

  // Показ модульного окна картинки
  ImagePopup.prototype.show = function() {
    this.element.classList.remove('popup-image--hidden');
    bodyTag.classList.add('body-noscroll');
    context = this;

    this.element.querySelector('.popup-image__img').src = this.getData().getPictures();
    this.element.querySelector('.popup-image__comment').textContent = this.getData().getComments();
    
    editButton.addEventListener('click', this._onEditComment);
    window.addEventListener('click', this._onOverlayClick);
    window.addEventListener('keydown', this._onEscClick);
  };

  // Закрытие модульного окна
  ImagePopup.prototype.close = function() {
    var isEditing = wrapper.classList.contains('editing');

    if (isEditing) {
      textaerea.classList.add('popup-image__commentfield--no-save');
      textaereaError.style.display = 'block';
      return; // Запрещаем закрытие модульного окна
    } else {
      textaerea.classList.remove('popup-image__commentfield--no-save');
      textaereaError.style.display = 'none';

      var data = new ImagesBase();
      loadedImages = data.getServerData();
      
      if (loadedImages == 'empty') {
        return;
      } else {
        console.log(loadedImages);
        loadedImages = loadedImages.map(function(image) {
          return new ImagesData(image);
        });
      }

      console.log(loadedImages);
      console.log(renderedElements);
      renderedElements = data.getRenderedElements();
      console.log(renderedElements);
      
      renderImages(loadedImages, true); // Обработка загруженных данных (отрисовка)

      function renderImages(imageElement, replace) {
        if (replace) {
          var el;
          while (el = renderedElements.shift()) {
            console.log(el.element);
            console.log(el);
            container.removeChild(el.element);
            el.onClick = null;
          }
        }
        console.log(renderedElements);
        var fragment = document.createDocumentFragment(); // Создаем фрагмент для экономии памяти

        renderedElements = renderedElements.concat(imageElement.map(function(image, i) {
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

          return imgPreview;
        }));
        console.log(renderedElements);
        container.appendChild(fragment);
      };

      this.element.classList.add('popup-image--hidden'); // Закрываем модульное окно
      bodyTag.classList.remove('body-noscroll');

      editButton.removeEventListener('click', this._onEditComment);
      window.removeEventListener('click', this._onOverlayClick);
      window.removeEventListener('keydown', this._onEscClick);
    }
  };

  /**
   * Обработчик клика вне модульного окна
   * @private
   */
  ImagePopup.prototype._onOverlayClick = function(evt) {
    if (evt.target == this.element) {
      this.close();
    }
  };

  /**
   * Обработчик кнопки Esc
   * @private
   */
  ImagePopup.prototype._onEscClick = function(evt) {
    if (evt.keyCode == 27) {
      this.close();
    }
  };

  /**
   * Обработчик клика по кнопке Изменить
   * @private
   */
  ImagePopup.prototype._onEditComment = function() {
    var wrapper = this.parentNode;
    console.log(wrapper);
    console.log(this);
    var comment = wrapper.querySelector('.popup-image__comment');
    var commentfield = wrapper.querySelector('.popup-image__commentfield');
    var isEditing = wrapper.classList.contains('editing');

    if (isEditing) {
      var editComment = commentfield.value;
      var index = context.getIndex();
      console.log(index);
      comment.innerText = editComment;
      this.innerText = 'Изменить';
      context.addEditServerData(editComment, index);
      textaerea.classList.remove('popup-image__commentfield--no-save');
      textaereaError.style.display = 'none';
    } else {
      commentfield.value = comment.innerText;
      this.innerText = 'Сохранить';
    }

    wrapper.classList.toggle('editing');
  };

  // Прокидываем в глобальный объект
  window.ImagePopup = ImagePopup;

})();