'use strict';
require('dotenv').config();// dotenv
const express = require("express"); // express intitialization & socketIO
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: { origin: "*" }
});

const path = require('path'); // path 
const cors = require("cors"); //cors
app.use(cors());
//{path: '/test'}


require('./controllers/socketio.controller')(io)

app.use((req, res, next) => {
	req.io = io
	next()
})

const morgan = require('morgan');   // morgan & winston combined logger setup
const { handleError } = require('./utils/errorHandler');
// const winston = require('./utils/logger')
app.use(morgan('tiny'));
// app.use(morgan('combined', {
// 	stream: winston.stream
// }));

app.use(express.json()); // parse requests of content-type - application/json


app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

app.response.sendResponse = function (data, message, statusCode) {
	statusCode = statusCode ? statusCode : 200
	return this.status(statusCode).send({
		success: true,
		status: statusCode,
		message: message,
		data: data,
	})
};

const responseEnv = ["development", "test"]
app.response.sendError = function (err) {
	const { statusCode, message, stack, expose } = err;
	return this.status(statusCode).send({
		success: false,
		status: statusCode,
		expose: expose,
		error_message: message,
		...(responseEnv.includes(process.env.NODE_ENV)) && { error_stack: stack }
	});
};

app.use('/dns', require('./routes/index.routes.js'))

app.use((req, res, next) => {
	res.status(404).send({
		msg: `Requested URL ${req.get('host')}${req.path} not found!`
	});
})

app.use((err, req, res, next) => {
	handleError(err, res);
});

async function start() {
	try {
		console.log("=> starting the server ...")
		await require("./utils/dbhelper");
		console.log("=> dbhelper file executed")
		const port = process.env.PORT || 4000
		// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
		server.listen(port, () => console.log(' Server listening on port ' + port));

	} catch (error) {
		console.log(error)
	}
}
start()
// module.exports = io