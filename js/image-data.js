'use strict';

(function() {

  /**
   * @param {Object} data
   * @constructor
  */
  var ImagesData = function(data) {
    this.params = data;
  };

  /**
  * @return {Object}
  */
  // Данный метод возвращает картинку
  ImagesData.prototype.getPictures = function() {
    return this.params.url;
  };

  /**
  * @return {Object}
  */
  // Данный метод возвращает комментарий
  ImagesData.prototype.getComments = function() {
    return this.params.comment;
  };

  // Прокидываем в глобальный объект
  window.ImagesData = ImagesData;

})();