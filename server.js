var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/chathtml.js',function(req, res){
    res.sendFile(__dirname + '/chathtml.js');
  });

var count = 0;
var usernamedict = {};
var usercolordict = {};
io.on('connection', function(socket){
  d = new Date();
  time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  console.log(socket.id + " is connected, count is "+ count + ' at ' + time);
  io.to(socket.id).emit('change name', 'No.'+count);
  socket.count = count;

  count = count+1;

  var red = Math.floor (Math.random() * 196);
  var green = Math.floor (Math.random() * 196);
  var blue = Math.floor (Math.random() * 196);
  socket.color = '#' + red.toString(16) + green.toString(16) + blue.toString(16);
  usernamedict[socket.count.toString()] = 'No.'+socket.count;
  usercolordict[socket.count.toString()] = socket.color;

  var d = new Date();
  var time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  io.emit('receive message', "SERVER", usernamedict[socket.count.toString()] + "("+ socket.count+") has connected.", time, socket.color);
  io.emit('change userlist', usernamedict, usercolordict);

  socket.on('disconnect', function(){
    d = new Date();
    time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    console.log(socket.id +" has disconnected, count was "+ count + ' at ' + time);
    io.emit('receive message', "SERVER", usernamedict[socket.count.toString()] + "("+ socket.count+") has disconnected.", time, socket.color);

    if (!delete usernamedict[socket.count.toString()]){
      console.log("error deleting disconnected user");
    }
    if (!delete usercolordict[socket.count.toString()]){
      console.log("error deleting disconnected user");
    }
    io.emit('change userlist', usernamedict, usercolordict);
  });

  socket.on('send message', function(name, text){
    if(name!=usernamedict[socket.count.toString()]){
      if(name == ''){
        io.to(socket.id).emit('change name', usernamedict[socket.count.toString()]);
        name = usernamedict[socket.count.toString()];
      }else{
        io.emit('receive message', "SERVER", usernamedict[socket.count.toString()] +"("+ socket.count+") has changed name to " +name +"("+ socket.count+").", time, socket.color);
        usernamedict[socket.count.toString()]=name;
        io.emit('change userlist', usernamedict, usercolordict);
      }
    }



    d = new Date();
    time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    console.log(name + ' : ' + text + ' ('+time+') '+socket.color);
    io.emit('receive message', name, text, time, socket.color);
  });
});

http.listen(3000, function(){
  console.log('server on!');
  

});
