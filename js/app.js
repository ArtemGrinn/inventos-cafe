(function(){
  "use strict";

  window.onload = function(){
    var container = document.querySelector('.content');
    sendRequest('http://helenj.myjino.ru/meals.js', 'GET', function(response){
      localStorage.setItem('data', response);
      var data = JSON.parse(localStorage.getItem('data'));
      container.innerHTML = '';
      container.appendChild(createCategories(data.categories));
    });
  }

  function createCategories(ctgs){
    var categories = document.createElement('div');
    [].forEach.call(ctgs, function(ctg){
      var wrapper = document.createElement('div');
      var label = document.createElement('span');
      label.innerHTML = ctg.name;
      var link = document.createElement('a');
      link.href='';
      link.innerHTML = 'Выбрать';
      wrapper.appendChild(label).appendChild(link);
      categories.appendChild(wrapper);
    });
    return categories;
  }

  function sendRequest(url, method, callback){
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    var result;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200)
        callback && callback(xhr.responseText);
    }
    xhr.send();
  }
})();
