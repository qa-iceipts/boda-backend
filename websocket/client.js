
const io = require("socket.io-client");
let socket = io("http://localhost:4200",{query:'rideId=5'});

socket.on("onconnect", (data) => {

   console.log("Message: ", data);

   let reqObj = {
      "user_id": "1",
      "pick_lat": "37.4219983",
      "pick_long": "-122.084",
      "drop_lat": "37.4219983",
      "drop_long": "-122.084",
      "rideId": "5",
      "vehicle_type": [1]
   }
   
   socket.emit("getAvailableRides", reqObj);
});


socket.on("getAvailableRidesCallback", (data) => {  
    console.log("Message: ", data);
      // show loader to user
 });
 socket.on("nearbyDriversList", (data) => {
   
   console.log("Message: ", JSON.stringify(data.result.data));
   socket.emit("getOffers", {
      rideId: 5,
      range : 50
   });
   // stop the loader display list
});
socket.on("error", (data) => {
   
   console.log("Message: ", data);
   // stop the loader display list
});
