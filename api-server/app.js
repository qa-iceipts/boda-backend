// dotenv
require('dotenv').config()
// express intitialization
const express = require("express");
const app = express();
const expressValidator = require('express-validator');


// path 
const path = require('path');

// http & bodyparser
const http = require('http');
const bodyParser = require("body-parser");
const createError = require('http-errors');

// SWAGGER START
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
			termsOfService: "http://example.com/terms/",
			contact: {
				name: "API Support",
				url: "http://www.exmaple.com/support",
				email: "support@example.com",
			},
		},

		servers: [{
			url: "http://localhost:4001",
			description: "My API Documentation",
		}, ],
	},
	apis: ["./Routes/*.js"],
};
const specs = swaggerJsDoc(options);
app.use("/api/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

// SWAGGER END

// morgan & winston combined logger setup
const morgan = require('morgan');
const winston = require('./utils/logger')
app.use(morgan('tiny'));
app.use(morgan('combined', {
	stream: winston.stream
}));

// CORS 
const cors = require("cors");
// var corsOptions = {
// 	origin: "http:
//localhost:8081"
// };
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


// async function DBserver() {
// 	await 
dbhelper().then(() => {
	console.log("dbhelper promise done")

	// EXPRESS ROUTER SECTION

	const db = require('./models/index')
	const routes = require('./routes/routes.js')
	app.use('/api', routes)

	app.use("*", (req, res, next) => {
		const error = {
			status: 404,
			message: "API ENDPOINT NOT FOUND ON SERVER",
		};
		res.status(404).send(error);
	});
	// sync the db
	db.sequelize.sync({
		force: false
	}).then(() => {
		console.log('Database Synced.');
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}.`);
		});

	}).catch(err => {
		console.error('Unable to sync the database:', err);
	})

}).catch(err => {
	console.log(err)
})
// }

// DBserver()