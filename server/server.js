const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  //greeting
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  //new user joined
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined'));

  //socket.emit emits event to single connection
  // socket.emit('newMessage', {
  //     from: 'abc',
  //     text: 'def',
  //     createdAt: 123
  // });

  socket.on('createMessage', (message) => {
    console.log('Created message', message);
    //io.emit emits event to every connection
    io.emit('newMessage', generateMessage(message.from, message.text));

    //broadcasting - emiting an event to everyone exept specific user
    //sockets tells to which user event will not be emitted
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
