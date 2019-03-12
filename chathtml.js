var socket = io(); 

$(document).ready(function(){
    $('#message').focus();
});

$('#chat').on('submit', function(e){ 
    if($('#message').val() != ""){
        socket.emit('send message', $('#name').val(), $('#message').val());
        $('#message').val('');
        $('#message').focus();
    }
    e.preventDefault();
});

socket.on('receive message', function(name, text, time, color){ 
    $('#chatLog').append ('<a>(' + time + ') '+'<span style="color:'+color+'">'+name+'</span> '+' : '+text+'</a><br/>');
    $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
});

socket.on('change name', function(name){ 
    $('#name').val(name);
});
socket.on('change userlist', function(usernamedict, usercolordict){ 
    $('#userlist').empty();
    var userlistval = '<a>';
    for(var key in usernamedict){
        userlistval += '<span style="color:'+usercolordict[key]+'">'+usernamedict[key]+'</span>('+key+')<br/>';
    }
    userlistval += '</a>';
    $('#userlist').append(userlistval);
});