'use-strict'
const { sendNotifications } = require('../services/notifications-service')
const { addChat, getChats } = require('../services/chats')
const createHttpError = require('http-errors')
const {
   DeleteDNSConnection,
   addDNSConnection,
   getNearbyDrivers,
   fetchDrivers,
   getTokensByIds,
   getResponse,
   getSocketId
} = require('../services/socket-io-service')

exports = module.exports = function (io) {

   // when client connection with new connection 
   io.on('connection', async function (socket) {
      console.log(
         'A new user connected =>', socket.id,
         "rideId => " + socket.handshake.query.rideId,
         "userId => " + socket.handshake.query.userId,
         "user_type => " + socket.handshake.query.user_type
      );

      socket.join(socket.handshake.query.userId);
      // connection Object
      connObj = {
         rideId: socket.handshake.query.rideId,
         socketId: socket.id,
         userId: socket.handshake.query.userId,
         user_type: socket.handshake.query.user_type,
      }

      socket.userObj = connObj
      // connectedUsers[connObj.userId] = socket;

      try {
         await addDNSConnection(connObj)

         socket.emit("onconnect", { message: "welcome User", socketId: socket.id });

         //Whenever someone disconnects this piece of code executed
         socket.on('disconnect', () => disconnectUser(socket));

         socket.on('getAvailableRides', data => getAvailableRides(data, socket));

         socket.on('getOffers', data => getOffers(data, socket));

         socket.on('onchat', data => onChat(data, socket, io));

      } catch (err) {
         handleError(err, socket)
      }
   })

}

// disconnect logic
async function disconnectUser(socket) {
   try {
      let result = await DeleteDNSConnection(socket.id);
      console.log('A user disconnected', result);
   } catch (err) {
      handleError(err, socket)
   }
}

async function getAvailableRides(data, socket) {
   try {
      console.log("hello", data)
      socket.emit('getAvailableRidesCallback', { data: "dataReceived" });
      let result = await getNearbyDrivers(data)
      socket.emit('nearbyDriversList', { result: result });
   } catch (err) {
      err.eventName = "noDriversFound"
      handleError(err, socket)
   }
}

function handleError(err, socket) {
   console.error("Socket Error => ", err)
   if (socket) {
      if (err.response && err.response.data && err.response.data.expose) {
         socket.emit("error", err.response.data)
      } else {
         socket.emit(err.eventName ? err.eventName : "error", { success: false, status: err.statusCode ? err.statusCode : 500, error: err.name, error_message: err.message });
      }

   }
}

async function getOffers(data, socket) {
   try {
      console.log("getOffers event called", data);
      const driverIds = await fetchDrivers(data)
      console.log(driverIds)

      let fcmtokens = await getTokensByIds(driverIds)

      console.log(fcmtokens.data)

      let message = {
         notification: {
            title: "New Ride Request",
            body: "Quote your prices now for customer"

         },
         android: {
            notification: {
               clickAction: 'pickupRequests_intent'
            }
         },
         tokens: fcmtokens.data,
      };

      await sendNotifications(message)

      console.log("Notifications sent")
      socket.emit("notified", "Sent Notification to " + driverIds.length + "users")
      // setTimeout(emitData, 60000);
   } catch (err) {
      handleError(err, socket)
   }

}

async function onChat(data, socket, io) {
   try {
      console.log(data)
      let insertObj = {
         msg: data.content,
         driverId: socket.userObj.user_type == 3 ? data.to : socket.userObj.userId,
         customer_id: socket.userObj.user_type == 3 ? socket.userObj.userId : data.to,
         rideId: data.rideid,
         user_type: socket.userObj.user_type
      }
      console.log("insertObj::", insertObj)

      await addChat(insertObj)
      console.log("socket.userObj ::", socket.userObj)
      let fcmtokens = await getTokensByIds(data.to)
      console.log("fcm tokens", fcmtokens.data)

      io.to(data.to).emit("privateMsg", {
         content: data.content,
         name: data.name,
         from: socket.id,
         sender: socket.userObj.userId,
         rideId: data.rideid
      });

      if (!fcmtokens.data && fcmtokens.data.length <= 0)
         throw new createHttpError.NotAcceptable("fcm tokens not found")

      let message = {
         notification: {
            title: "New Message",
            body: data.content
         },
         android: {
            notification: {
               clickAction: 'chat_notification'
            }
         },
         data: {
            data: JSON.stringify({
               sender: socket.userObj.userId,
               rideId: data.rideid
            })
         },
         tokens: fcmtokens.data,
      };
      console.log("chat msg notification", message)
      await sendNotifications(message)

   } catch (err) {
      handleError(err, socket)
   }

}

async function emitData() {

   console.log("hey emitDATA")
   let result = await getResponse(data.rideId)
   socket.emit('driverResponse', { data: result });

   // .catch(err => {
   //    console.log(err)
   //    // socket.emit('error', { data: "error", err: err });
   //    socket.emit('noDriversFound', { data: "no Nearby Drivers Found" });
   // })

}