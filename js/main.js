window.onload = () => {
  'use strict';
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }

  fetch('https://jsonplaceholder.typicode.com/photos')
  .then(response => response.json())
  .then(json => {
    var items = json.slice(0,10);
    albumMaker(items);

    document.getElementById("search_input").addEventListener('keyup', function(e){
      var value = e.target.value;
      var album_items = items.filter(item => item.title.includes(value));
      albumMaker(album_items);
    })
  });
}
function albumMaker(items) {
  var album = '';
  for(var i=0; i <= items.length - 1; i++){
    album += '<div class="card"><img src="' + items[i].thumbnailUrl + '" /><div class="card-title">'+ items[i].title +'</div></div>';
  };
  document.getElementById("album").innerHTML = album;
}

Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
    displayNotification()
});

function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
        body: 'Welcome to PWA world ;)',
        icon: '../images/hello-icon-128.png',
        vibrate: [100, 50, 100]
      };
      reg.showNotification('Hello world!', options);
    });
  }
}