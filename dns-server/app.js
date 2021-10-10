'use strict';
// dotenv
require('dotenv').config();
// express intitialization & socketIO
const express = require("express");
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server,{path: '/dns/socket.io'},{
    cors:{ origin: "*"}
});

require('./utils/socketio')(io)

// path 
const path = require('path');

// morgan & winston combined logger setup
const morgan = require('morgan');
const winston = require('./utils/logger')
app.use(morgan('tiny'));
app.use(morgan('combined', {
	stream: winston.stream
}));
// CORS 
const cors = require("cors");
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// app.use(expressValidator());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// IMPORT DATABASE HELPER
const {
	dbhelper
} = require("./utils/dbhelper")

dbhelper().then(() => {
	console.log("dbhelper promise done")

	// EXPRESS ROUTER SECTION
	const db = require('./models/index')

   	const routes = require('./routes/routes.js')
	
    app.use('/dns', routes)

	// sync the db
	db.sequelize.sync({
		force: false
	}).then(() => {
		console.log('Database Synced.');
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}.`);
		});

	}).catch(err => {
		console.error('Unable to sync the database:', err);
	})

}).catch(err => {
	console.log(err)
})
 
//Whenever someone connects this gets executed
// io.on('connection', function(socket){
//    console.log('A user connected',socket.id);
//    console.log("rideId => " +  socket.handshake.query.rideId);
//    socket.emit("welcome", {a:"hyy"});
//    //Whenever someone disconnects this piece of code executed
//    socket.on('disconnect', function () {
//       console.log('A user disconnected');
//    });

//    socket.on('message', function (data) {
//     console.log(data);
	
//  });
//  socket.on('ride', function (data) {
//     console.log(data);
	
//  });

// });
// server.listen(3001, function(){
//    console.log('listening on *:3001');
// });

module.exports = io