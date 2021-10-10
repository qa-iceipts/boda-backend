'use strict';

// dotenv
require('dotenv').config()

// express intitialization
const express = require("express");
const app = express();

// path 
const path = require('path');

// http & bodyparser
const http = require('http');
const bodyParser = require("body-parser");
const createError = require('http-errors');

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
	app.use('/location', routes)

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