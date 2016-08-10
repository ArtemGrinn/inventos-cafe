(function(){
  "use strict";
  
  var data = {};
  var contentContainer = document.querySelector('.content');
  var categoriesContainer  = document.querySelector('.categories');

  window.onload = function(){
    sendRequest('http://helenj.myjino.ru/meals.js', 'GET', main);
  }

  function main(response){
      data = JSON.parse(response);
      
      categoriesContainer.innerHTML = '';
      categoriesContainer.appendChild(createCategories(data.categories));
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
      link.addEventListener('click', function(e){
        e.preventDefault();
        showCategory(ctg.id);
      });
      wrapper.appendChild(label).appendChild(link);
      categories.appendChild(wrapper);
    });
    return categories;
  }

  function showCategory(id){
    contentContainer.innerHTML = '';
    var filtered = data.meals.filter(function(meal){
      return meal.category_id == id;
    }).slice(0, 20);
    
    [].forEach.call(filtered, function(item){
      var wrapper = document.createElement('div');
      var a = document.createElement('a');
      a.href='';
      a.innerHTML = item.name;
      wrapper.appendChild(a); 
      contentContainer.appendChild(wrapper);
    });
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
