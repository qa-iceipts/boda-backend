/*
  firebase/index.js
*/
const firebase = require("firebase-admin");

// const credentials = require("../config/firebase_config");

const credentials = require("../config/boda-app-90859-firebase-adminsdk-fluaz-ab20b8ba92.json")
console.log("credentials>>>", credentials)
firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL: "https://<yourproject>.firebaseio.com",
});


module.exports = firebase;