const firebase = require("./firebase");
var HttpStatus = require('http-status-codes');
module.exports = {

   authMiddleware : function (req, res, next) {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
  
    return res.status(401).send({ message: "No token provided" });
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  const token = headerToken.split(" ")[1];
  console.log("token::",token)
  firebase
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      console.log("decodedToken::", decodedToken)
      next()
    })
    .catch(() =>{
      res.status(HttpStatus.StatusCodes.FORBIDDEN).send({ message: "Could not authorize" });
    } 
    );
}



  }