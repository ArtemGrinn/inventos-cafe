(function(){
  "use strict";

  var form = document.forms[0];
  form.addEventListener('submit', function(e){
    e.preventDefault();

    var data = {};
    for (var i = 0; i < form.length; ++i) {
      var input = form[i];
      if (input.name) {
        data[input.name] = input.value;
      }
    }
    data['order'] = JSON.parse(localStorage.getItem('inventos-kafe-order')) || {};
    localStorage.removeItem('inventos-kafe-order');
    debugger
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'localhost', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(data));
  });

})();