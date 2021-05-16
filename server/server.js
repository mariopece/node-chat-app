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


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage({ auth:'Admin', msg: params}));

    callback();
  });


  socket.on('spawnplayer', (data, callback) => {

    var user = users.getUser(socket.id);

      io.to(user.room).emit('spawnplayer', generateMessage({ auth:'Admin', msg: 'new user', user: user}));
    

    callback();

  });
  

  socket.on('createMessage', (message, callback) => {


    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage({ auth:'Admin', msg: message, user: user}));
    }

    callback();

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
      io.to(user.room).emit('removePlayer', generateMessage({ auth:'Admin', msg: `${user.name} has left`, user: user, id: socket.id}));
      
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
