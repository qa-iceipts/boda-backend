const firebase = require("../utils/firebase/firebase");
//var HttpStatus = require('http-status-codes');
const createHttpError = require('http-errors')
module.exports = {

  authMiddleware: function (req, res, next) {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).send({ message: "No token provided" });
    }

    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
      return res.status(401).send({ message: "Invalid token" });
    }

    const token = headerToken.split(" ")[1];
    console.log("token::", token)
    firebase
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        next()
      })
      .catch((err) => {
        // throw new createHttpError.Forbidden("User Not Verified")
        res.status(403).send({ message: "Could not authorize" });
      }
      );
  }



}