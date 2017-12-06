const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

var p = 0;
var i = 0;
var count = 15*10;
var timerid;
io.on('connection', function(socket){
    socket.userid = i++;
    console.log("connected");
    if(i==2){
	console.log("let's start!!");
	timerid = setInterval(function(){
	    count--;
	    io.emit('informtiming',count);
	    console.log("request....");
	}, 100);
    }
    socket.emit('userinfo',
		{
		    user:socket.userid
		});
    socket.on('informcount',function(data){
	console.log(data);console.log(socket.userid);
	socket.broadcast.emit('count',data);
    });
    socket.on('hog',function(data){
	console.log(data);console.log(socket.userid);
	socket.broadcast.emit('count',{
	    user:socket.userid,
	    data:data.count
	});
    });
    socket.on('disconnect',function(){
	io.emit("AFK");
	console.log("disconnected");
	count = 15*10;
	i--;
	clearInterval(timerid);
    });
    console.log("hogeend");
});

http.listen(port, 'localhost', () => console.log('listening on port ' + port));
