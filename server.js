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

function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

var count = 0;
var usernamedict = {};
var usercolordict = {};
io.on('connection', function(socket){
  d = new Date();
  time = pad(d.getHours(),2) + ':' + pad(d.getMinutes(),2) + ':' + pad(d.getSeconds(),2);
  console.log(socket.id + " is connected, count is "+ count + ' at ' + time);
  socket.count = count;

  count = count+1;

  var red = Math.floor (Math.random() * 196);
  var green = Math.floor (Math.random() * 196);
  var blue = Math.floor (Math.random() * 196);
  socket.color = '#' + red.toString(16) + green.toString(16) + blue.toString(16);
  usernamedict[socket.count.toString()] = count+'번째 사람';
  io.to(socket.id).emit('change name', usernamedict[socket.count.toString()]);
  usercolordict[socket.count.toString()] = socket.color;

  var d = new Date();
  time = pad(d.getHours(),2) + ':' + pad(d.getMinutes(),2) + ':' + pad(d.getSeconds(),2);
  io.emit('receive message', "SERVER", usernamedict[socket.count.toString()] + "("+ socket.count+")님이 들어왔습니다.", time, socket.color);
  io.emit('change userlist', usernamedict, usercolordict);

  socket.on('disconnect', function(){
    d = new Date();
    time = pad(d.getHours(),2) + ':' + pad(d.getMinutes(),2) + ':' + pad(d.getSeconds(),2);
    console.log(socket.id +" has disconnected, count was "+ count + ' at ' + time);
    io.emit('receive message', "SERVER", usernamedict[socket.count.toString()] + "("+ socket.count+")님이 나갔습니다.", time, socket.color);

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
        io.emit('receive message', "SERVER", usernamedict[socket.count.toString()] +"("+ socket.count+")님이 이름을 " +name +"("+ socket.count+")로 바꿨습니다.", time, socket.color);
        usernamedict[socket.count.toString()]=name;
        io.emit('change userlist', usernamedict, usercolordict);
      }
    }
    d = new Date();
    time = pad(d.getHours(),2) + ':' + pad(d.getMinutes(),2) + ':' + pad(d.getSeconds(),2);
    console.log(name + ' : ' + text + ' ('+time+') '+socket.color);
    io.emit('receive message', name, text, time, socket.color);
  });
});

http.listen(3000, function(){
  console.log('server on!');
  

});
