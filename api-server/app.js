// dotenv
require('dotenv').config()
// express intitialization
const express = require("express");
const app = express();
// path 
const path = require('path');

const { handleError } = require('./utils/errorHandler')

// morgan & winston combined logger setup
const morgan = require('morgan');
const winston = require('./utils/logger')
app.use(morgan('tiny'));
// app.use(morgan('combined', {
// 	stream: winston.stream
// }));

// CORS 
const cors = require("cors");
// var corsOptions = {
// 	origin: "http:
//localhost:8081"
// };
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
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
		message : message,
		data: data,
	})
};

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// IMPORT DATABASE HELPER
// const { dbhelper } = require("./utils/dbhelper")

app.use('/api', require("./routes/routes"))

app.use((req, res, next) => {
	res.status(404).send(`Requested URL ${req.get('host')}${req.path} not found!`);
})

app.use((err, req, res, next) => {
	handleError(err, res);
});

async function start() {
	try {
		// await dbhelper()
		// console.log("dbhelper promise done")
		// sync the db
		// await db.sequelize.sync({
		// 	force: false
		// })
		await require("./utils/dbhelper");
		console.log("=> dbhelper promise done")
		// console.log('Database Synced.');
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}.`);
		});

	} catch (err) {
		console.error('Unable to sync the database:', err);
	}
}

start()