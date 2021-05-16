const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // socket.emit('newMessage', {
  //     from: 'abc',
  //     text: 'def',
  //     createdAt: 123
  // });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //socket.leave('The Office Fans');

    // io.emiting - sending to everyone
    // socket.broadcast.emit - sending to everyone except for current user
    // socket.emit - emits specificly to the socket user

    // io.emit -> io.to('The office fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The office fans').emit
    // socket.emit

    //greeting
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage({ auth:'Admin', msg: params}));

    callback();
  });


  
    //server side event acknowledgement sent to client (browser)
  socket.on('spawnplayer', (data, callback) => {
    //console.log('Created message', message);
    //io.emit emits event to every connection

    var user = users.getUser(socket.id);

      io.to(user.room).emit('spawnplayer', generateMessage({ auth:'Admin', msg: 'new user', user: user}));
    

    callback();
    //broadcasting - emiting an event to everyone exept specific user
    //sockets tells to which user event will not be emitted
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });
  
  
  
  //server side event acknowledgement sent to client (browser)
  socket.on('createMessage', (message, callback) => {
    //console.log('Created message', message);
    //io.emit emits event to every connection

    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage({ auth:'Admin', msg: message, user: user}));
    }

    callback();
    //broadcasting - emiting an event to everyone exept specific user
    //sockets tells to which user event will not be emitted
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    //console.log('User disconnected');
    var user = users.removeUser(socket.id);

    if (user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage({ auth:'Admin', msg: `${user.name} has left`, user: user}));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
