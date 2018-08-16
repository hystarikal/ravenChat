//Citation: https://socket.io/docs/
//Citation: https://socket.io/docs/server-api/
//Citation: https://socket.io/docs/client-api/
//I referred to the socket.io website for help on the
//server side code for the project.

var usernameArray = [];
var express = require('express');
var app = express();
server = require('http').createServer(app);

io = require('socket.io').listen(server);
server.listen(3000);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//Receiving the event on server side.
io.sockets.on('connection', function(socket){
    socket.on('Message sending', function(data){
        io.sockets.emit('sending new message', {msg: data, user: socket.username}); //This sends it out to all users.
    });

    socket.on('Adding new user', function(data, callback){
        //Checking whether a username is available.
        if(usernameArray.indexOf(data) != -1){
            callback(false);    
        }
        else{
            callback(true);
            socket.username = data;
            usernameArray.push(socket.username);
            updateUsernames();
        }
    })

    socket.on('disconnect', function(data){
        if(!socket.username){
            return;
        }
        usernameArray.splice(usernameArray.indexOf(socket.username), 1);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('usernames', usernameArray);
    }
});