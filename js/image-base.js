'use strict';

(function() {

  var arrNewData = [];
  var renderedElements = [];

  /**
   * @constructor
   */
  var ImagesBase = function() {};

  // Определяем свойство data на уровне прототипа объекта ImagesBase
  ImagesBase.prototype._data = null;

  /**
  * @return {Object}
  */
  // Данный метод возвращает объект с данными
  ImagesBase.prototype.getData = function() {
    return this._data;
  };

  /**
  * @return {Object}
  */
  // Данный метод возвращает индекс объекта с данными
  ImagesBase.prototype.getIndex = function() {
    return this._index;
  }

  /**
  * @param {Object} data
  * @param {Object} index
  */
  // Данный метод записывает данные объекта и индекс этого объекта
  ImagesBase.prototype.setData = function(data, index) {
    this._data = data;
    this._index = index;
  };

  ImagesBase.prototype.setServerData = function(data) {
    arrNewData = arrNewData.concat(data);
    return console.log(arrNewData);
  };

  /**
  * @param {Object} data
  */
  // Данный метод записывает данные в LocalStorage
  ImagesBase.prototype.addServerData = function(data) {
    var oldArrData = [];
    for (var i = 0; i < arrNewData.length; i++) {
      oldArrData[i] = arrNewData[i];
    }
    console.log(oldArrData);

    arrNewData = arrNewData.concat(data);
    console.log(arrNewData);

    if (arrNewData.length > oldArrData.length) {
      console.log('больше');
      var jsonData = JSON.stringify(arrNewData);
      localStorage.setItem('data', jsonData);
    }
  };

  /**
  * @return {Object}
  */
  // Данный метод возвращает данные из LocalStorage
  ImagesBase.prototype.getServerData = function() {
    var jsonData = localStorage.getItem('data');
    if (jsonData == null || jsonData == 'undefined') {
      return 'empty';
    } else {
      var dataFromJson = JSON.parse(jsonData);
      return dataFromJson;
    }
  };

  /**
  * @param {Object} data
  * @param {Object} index
  */
  // Данный метод записывает измененные данные одного объекта и сохраняет в LocalStorage
  ImagesBase.prototype.addEditServerData = function(data, index) {
    arrNewData[index].comment = data;
    console.log(arrNewData);
    var jsonData = JSON.stringify(arrNewData);
    localStorage.setItem('data', jsonData);
  };

  ImagesBase.prototype.setRenderedElements = function(componentElement) {
    renderedElements.push(componentElement);
  };

  ImagesBase.prototype.getRenderedElements = function() {
    return renderedElements;
  };

  // Прокидываем в глобальный объект
   window.ImagesBase = ImagesBase;

})();