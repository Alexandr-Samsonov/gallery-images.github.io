(function() {

  /**
  * @param {Object} data
  * @constructor
  */
  function ImagePreview() {
    // Фиксируем контекст в конструкторе
    this._onClick = this._onClick.bind(this);
  }

  ImagePreview.prototype = new ImagesBase();

  // Создание картинки-превью из шаблона
  ImagePreview.prototype.render = function() {
    var template = document.querySelector('.template-images-list');

    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    console.log(this.element);

    this.element.querySelector('.images__comment').textContent = this.getData().getComments();

    var backgroundImage = new Image();

    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      this.element.querySelector('.images__img').style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
    }.bind(this);

    backgroundImage.onerror = function() {
      this.element.querySelector('.images__img').classList.add('img-nophoto');
    }.bind(this);

    /**
     * @const
     * @type {number}
     */
    var IMAGE_TIMEOUT = 10000;

    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // Прекращаем загрузку
      this.element.querySelector('.images__img').classList.add('img-nophoto'); // Показываем ошибку
    }.bind(this), IMAGE_TIMEOUT);

    backgroundImage.src = this.getData().getPictures();

    this.element.querySelector('.images__img').addEventListener('click', this._onClick);
  };

  ImagePreview.prototype.remove = function() {
    this.element.querySelector('.images__img').removeEventListener('click', this._onClick);
  };

  /**
   * @param {Event} evt
   * @private
   */
  ImagePreview.prototype._onClick = function(evt) {
    evt.preventDefault(); // Отмена стандартного клика
    
    // Клик, который транслируется наружу должен происходить по фону элемента,
    // если у него есть фотография.
    // Первая проверка, что клик произошел действительно по блоку-превью проекта, а не по какому нибудь другому месту
    if ((evt.target.classList.contains('images__img') || evt.target.classList.contains('images__comment')) &&
      !this.element.querySelector('.images__img').classList.contains('img-nophoto')) {
      // Нужно вызвать коллбэк, который будет переопределен снаружи
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };

  ImagePreview.prototype.onClick = null;

  // Прокидываем в глобальный объект
  window.ImagePreview = ImagePreview;

})();