var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    //_blank tells to the browser to open a new tab instead of redirecting within current one
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    //query method. One argument fetch the value, when 2 arguments value is set
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

//event acknowledgement by adding callback function
// socket.emit('createMessage', {
//   from: 'person x',
//   text: 'hello!'
// }, function(data){
//   console.log('Got it!', data);
// });

//e - event
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    //clearing text field after its sent to the server
    messageTextbox.val('');
  });
});

//saving the selector
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation){
      return alert('Geolocation not supported by your browser');
    }

    //jquery attr mettod lets set atribute
    //button is disabled when location is retreived
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
      //console.log(position);

      //removing atribute to unlock the button
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function(){
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.')
    });
});
