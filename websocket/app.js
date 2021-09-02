var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server,{
    cors:{ origin: "*"}
});

app.get('/', function(req, res){ res.send("SOcket io Server") });
// 
//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected',socket.id);
   socket.emit("welcome", {a:"hyy"});
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });

   socket.on('message', function (data) {
    console.log(data);
 });

});
server.listen(3000, function(){
   console.log('listening on *:3000');
});