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
      showCategories();
  }

  function showCategories(){
    contentContainer.innerHTML = '';
    [].forEach.call(Data.categories, function(category){
      var wrapper = document.createElement('div');     
      var label = document.createElement('span');
      label.className = 'category__label';
      label.innerHTML = category.name + ":";
      wrapper.appendChild(label);

      if(Order[category.id]){
        var selectedMeal = document.createElement('span');
        selectedMeal.className = 'category__meal';
        selectedMeal.innerHTML = Order[category.id].name + ' ' + Order[category.id].price + ' р';
        wrapper.appendChild(selectedMeal);

        var removeLink = document.createElement('a');
        removeLink.href='';
        removeLink.innerHTML = 'Удалить';
        removeLink.addEventListener('click', function(e){
          e.preventDefault();
          removeMeal(category.id);
        });   
      }

      var link = document.createElement('a');
      link.href='';
      link.innerHTML = Order[category.id] ? 'Изменить': 'Выбрать';
      link.addEventListener('click', function(e){
        e.preventDefault();
        showMeals(category.id);
      });   
      wrapper.appendChild(link);

      removeLink &&
      wrapper.appendChild(removeLink);
      contentContainer.appendChild(wrapper);
    });    
    
    contentContainer.appendChild(createTotalSum());
    contentContainer.appendChild(createNextButton());
  }

  function createNextButton(){
    var a = document.createElement('a');
    a.innerHTML = 'Далее';
    a.className = 'next';
    a.href = 'account.html';
    return a;
  }

  function createTotalSum(){
    var total = document.createElement('div');
    total.className = 'total';
    var sum = 0;
    [].forEach.call(Data.categories, function(category){
      if(Order[category.id]){
        sum += Order[category.id].price;
      }
    });
    var label = document.createElement('span');
    label.className = 'category__label';
    label.innerHTML = 'Итого:';
    var totalSum = document.createElement('span');
    totalSum.innerHTML = sum + ' Р';
    total.appendChild(label);
    total.appendChild(totalSum);
    return total;
  }

  function showMeals(id){
    contentContainer.innerHTML = '';
    var backBtn = document.createElement('a');
    backBtn.className = 'back-btn';
    backBtn.href='#';
    backBtn.innerHTML = 'Назад';
    backBtn.addEventListener('click', function(e){
      e.preventDefault();
      showCategories();
    });
    contentContainer.appendChild(backBtn);
    
    var mealsContainer = document.createElement('div');
    var input = document.createElement('input');
    input.className = 'meal-filter__input';
    input.placeholder = 'Найти';
    input.addEventListener('input', function(){
      createMeals(id, mealsContainer, input.value);
    });    
    contentContainer.appendChild(input);

    createMeals(id, mealsContainer);
    contentContainer.appendChild(mealsContainer);
  }

  function createMeals(id, container, filter=''){ 
    container.innerHTML = ''; 
    var filtered = Data.meals.filter(function(meal){
      return meal.category_id == id && ~meal.name.toLowerCase().indexOf(filter.toLowerCase());
    });

    [].forEach.call(filtered, function(item){
      var mealElement = createMeal(item);
      container.appendChild(mealElement);
    }); 
  }


  function createMeal(mealParams){
      var wrapper = document.createElement('div');
      wrapper.setAttribute('data-id', mealParams.id);
      wrapper.className = 'meal';

      var header = document.createElement('header');
      header.className = 'meal__header';
      header.innerHTML = mealParams.name;
   
      var video = document.createElement('video'); 
      video.className = 'meal__video';      
      if(mealParams.video){
        //var player = dashjs.MediaPlayer().create();
        //player.initialize(video, mealParams.video, false);
        //player.src({
        //  src: mealParams.video,
        //  type: 'application/x-mpegURL'
        //});  
        video.addEventListener('click', function(e){       
          //player.isPaused() ? player.play() : player.pause();
          //player.play();
        });
      }

      var price = document.createElement('div');
      price.className = 'meal__price';
      price.innerHTML = mealParams.price + ' руб.';

      var a = document.createElement('a');
      a.className = 'meal__link';
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
    showCategories(); 
  }

  function removeMeal(category_id){
    delete Order[category_id];
    saveOrderToStorage();
    showCategories(); 
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
