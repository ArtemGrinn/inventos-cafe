(function(){
  "use strict";
  
  var Data = {};
  var Order = {};
  var contentContainer = document.querySelector('.content');

  window.onload = function(){
    sendRequest('http://helenj.myjino.ru/meals.js', 'GET', main);
  }

  function main(response){
      Data = JSON.parse(response);
      loadOrderFromStorage();
      createCategories();
  }

  function createCategories(){
    contentContainer.innerHTML = '';
    [].forEach.call(Data.categories, function(category){
      var wrapper = document.createElement('div');     
      var label = document.createElement('span');
      label.className = 'label';
      label.innerHTML = category.name + ":";
      wrapper.appendChild(label);

      if(Order[category.id]){
        var selectedMeal = document.createElement('span');
        selectedMeal.className = 'selected-meal';
        selectedMeal.innerHTML = Order[category.id].name;
        wrapper.appendChild(selectedMeal);
      }

      var link = document.createElement('a');
      link.href='';
      link.innerHTML = Order[category.id] ? 'Изменить': 'Выбрать';
      link.addEventListener('click', function(e){
        e.preventDefault();
        showMeals(category.id);
      });   
      wrapper.appendChild(link);
      contentContainer.appendChild(wrapper);
    });    
    contentContainer.appendChild(createNextButton());
  }

  function createNextButton(){
    var button = document.createElement('button');
    button.innerHTML = 'Далее';
    button.className = 'next';
    return button;
  }

  function showMeals(id){
    contentContainer.innerHTML = '';
    var filtered = Data.meals.filter(function(meal){
      return meal.category_id == id;
    }).slice(0, 20);
    
    [].forEach.call(filtered, function(item){
      var mealElement = createMeal(item);
      contentContainer.appendChild(mealElement);
    });
  }

  function createMeal(mealParams){
      var wrapper = document.createElement('div');
      wrapper.setAttribute('data-id', mealParams.id);
      wrapper.classList.add('meal');

      var header = document.createElement('header');
      header.innerHTML = mealParams.name;
   
      var video = document.createElement('video');       
      if(mealParams.video){
        var player = dashjs.MediaPlayer().create();
        player.initialize(video, mealParams.video, false);
        //player.src({
        //  src: mealParams.video,
        //  type: 'application/x-mpegURL'
        //});  
        video.addEventListener('click', function(e){       
          //player.isPaused() ? player.play() : player.pause();
          player.play();
        });
      }

      var price = document.createElement('div');
      price.classList.add('price');
      price.innerHTML = mealParams.price + ' руб.';

      var a = document.createElement('a');
      a.href='#';
      a.innerHTML = 'Выбрать';
      a.addEventListener('click', function(e){
        e.preventDefault();
        selectMeal(mealParams);
      });

      wrapper.appendChild(header);
      wrapper.appendChild(video);
      wrapper.appendChild(price);
      wrapper.appendChild(a);
      return wrapper;
  }

  function selectMeal(mealData){   
    Order[mealData.category_id] = mealData;
    saveOrderToStorage();
    contentContainer.innerHTML = '';
    createCategories(); 
  }

  function saveOrderToStorage(){  
    localStorage.setItem('inventos-kafe-order', JSON.stringify(Order));
  }
  function loadOrderFromStorage(){     
    Order = JSON.parse(localStorage.getItem('inventos-kafe-order')) || {};
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
