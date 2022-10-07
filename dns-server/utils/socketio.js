const {
   DeleteDNSConnection,
   addDNSConnection,
   getNearbyDrivers,
   fetchDrivers,
   getTokensByIds,
   getResponse,
   getSocketId
} = require('../services/socket-io-service')
const { sendNotifications } = require('../services/notifications-service')
const { addChat, getChats } = require('../services/chats')

exports = module.exports = function (io) {

   // when client connection with new connection 
   io.on('connection', function (socket) {

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
      addDNSConnection(connObj).then(() => {
         socket.emit("onconnect",
            {
               msg: "welcome User",
               socketId: socket.id
            }
         );
         socket.on('getAvailableRides', function (data) {
            console.log("getAvailableRides called", data);
            socket.emit('getAvailableRidesCallback', { data: "dataReceived" });
            getNearbyDrivers(data).then((result) => {
               socket.emit('nearbyDriversList', { result: result });

               socket.on('getOffers', function (data) {
                  console.log("getOffers event called", data);
                  fetchDrivers(data).then(([result, driverIds]) => {
                     console.log(driverIds)
                     getTokensByIds(driverIds).then((fcmtokens) => {

                        console.log(fcmtokens.data)

                        let message = {
                           notification: {
                              title: "New Ride Request",
                              body: "Quote your prices now for customers"

                           },
                           android: {
                              notification: {
                                 clickAction: 'pickupRequests_intent'
                              }
                           },
                           tokens: fcmtokens.data,
                        };

                        sendNotifications(message).then((result) => {

                           console.log("Notifications sent")
                           function emitData() {
                              console.log("hey emitDATA")
                              getResponse(data.rideId).then(result => {
                                 // socket.emit(result)
                                 socket.emit('driverResponse', { data: result });
                              }).catch(err => {
                                 console.log(err)
                                 // socket.emit('error', { data: "error", err: err });
                                 socket.emit('noDriversFound', { data: "no Nearby Drivers Found" });
                              })

                           }
                           // setTimeout(emitData, 60000);
                        }).catch(err => {
                           console.log(err)
                           socket.emit('error', { data: "error", err: err });
                        });


                     }).catch(err => {
                        console.log(err)
                        socket.emit('error', { data: "error", err: err });
                     })
                     // console.log(result)
                  }).catch(err => {
                     console.log(err)
                     socket.emit('error', { data: "error", err: err });
                  })
               })
            }).catch(err => {
               console.log(err)
               socket.emit('noDriversFound', { data: "no Nearby Drivers Found" });
            })

         })

      }).catch(err => {
         console.log(err)
         socket.emit('error', { data: "addDNSConnectionerror", err: err });
      });

      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', function () {
         DeleteDNSConnection(socket.id).then((result) => {
            console.log('A user disconnected', result);
         }
         ).catch(err => {
            console.log(err)
            socket.emit('error', { data: "error", err: err });
         })

      });

      socket.on("onchat", (data) => {
         console.log(data)
         let insertObj = {
            msg: data.content,
            driverId: socket.userObj.user_type == 3 ? data.to : socket.userObj.userId,
            customer_id: socket.userObj.user_type == 3 ? socket.userObj.userId : data.to,
            rideId: data.rideid,
            user_type: socket.userObj.user_type
         }
         console.log("insertObj::", insertObj)
         // if(socket.userObj.user_type == 2 ){
         //    // he his Driver
         //    customer_id: data.to
         //    driverId: socket.userObj.userId
         // }
         addChat(insertObj).then(() => {
            console.log("socket.userObj ::", socket.userObj)
            getTokensByIds(data.to).then((fcmtokens) => {
               console.log("fcm tokens", fcmtokens.data)
               io.to(data.to).emit("privateMsg", {
                  content: data.content,
                  name: data.name,
                  from: socket.id,
                  sender: socket.userObj.userId,
                  rideId: data.rideid
               });
               if (fcmtokens.data && fcmtokens.data.length > 0) {

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
                     // data: {
                     //    sender : socket.userObj.userId,
                     //    rideId : data.rideid
                     // },
                     tokens: fcmtokens.data,
                  };
                  console.log("chat msg notification", message)
                  sendNotifications(message).then((result) => {
                  }).catch(err => {
                     console.log(err)
                     socket.emit('error', { data: "error" });
                  })
               } else {
                  socket.emit('error', { data: "no fcm tokens found", });
               }

            }).catch(err => {
               console.log(err)
               socket.emit('error', { data: "error", err: err });
            })

         }).catch(err => {
            console.log(err)
            socket.emit('error', { data: "error", err: err });
         })


      });


   });
}