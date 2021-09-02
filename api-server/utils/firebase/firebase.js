/*
  firebase/index.js
*/
const firebase = require("firebase-admin");

const credentials = require("../../config/firebase_config");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials.firebase_config),
  databaseURL: "https://<yourproject>.firebaseio.com",
});

module.exports = firebase;