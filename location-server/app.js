'use strict';

// dotenv
require('dotenv').config()

// express intitialization
const express = require("express");
const app = express();
const path = require('path');
const development = "development"
// morgan & winston combined logger setup
const morgan = require('morgan');
// const winston = require('./utils/logger')
app.use(morgan('tiny'));
// app.use(morgan('combined', {
// 	stream: winston.stream
// }));
// CORS 
const cors = require("cors");
const { handleError } = require('./utils/errorHandler.js');
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// app.use(expressValidator());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
	extended: true
}));
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

const responseEnv = ["development","test"]
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

app.use('/location', require('./routes/index.routes.js'))

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
		app.listen(port, () => console.log(' Server listening on port ' + port));

	} catch (error) {
		console.log(error)
	}
}
start()