const { addDNSConnection, getNearbyDrivers, fetchDrivers, getTokensByIds ,getResponse} = require('../services/socket-io-service')
const logger = require('../utils/logger');
const { sendNotifications } = require('../services/notifications-service')
exports = module.exports = function (io) {
   io.on('connection', function (socket) {
      console.log('A user connected', socket.id);
      console.log("rideId => " + socket.handshake.query.rideId);

      connObj = {
         rideId: socket.handshake.query.rideId,
         socketId: socket.id
      }
      addDNSConnection(connObj).then(() => {

         socket.emit("onconnect",
            {
               msg: "welcome User",
               socketId: socket.id
            }
         );
         socket.on('getAvailableRides', function (data) {
            // console.log("getAvailableRides called",data);
            socket.emit('getAvailableRidesCallback', { data: "dataReceived" });
            getNearbyDrivers(data).then((result) => {
               socket.emit('nearbyDriversList', { result : result });

               socket.on('getOffers', function (data) {
                  // console.log("getAvailableRides called", data);
                  fetchDrivers(data).then(([result, driverIds]) => {
                     //  console.log(driverIds)
                     getTokensByIds(driverIds).then((fcmtokens) => {
                         console.log(fcmtokens.data)
                        let notificationObj = {
                           title: "New Ride Request",
                           body: "Quote your prices now for customers"

                        }
                        sendNotifications(fcmtokens.data, notificationObj).then((result) => {
                           
                           console.log("Notifications sent")
                           function emitData() {
                              console.log("hey emitDATA")
                              getResponse(data.rideId).then(result=>{
                                 // socket.emit(result)
                                 socket.emit('driverResponse', {data:result});
                              }).catch(err=>{
                                 console.log(err)
                              })
                              
                           }
                           setTimeout(emitData, 60000);
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
               socket.emit('error', { data: "error", err: err });
            })

         })

      }).catch(err => {
         console.log(err)
         socket.emit('error', { data: "addDNSConnectionerror", err: err });
      });

      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', function () {
         console.log('A user disconnected');
      });

      // socket.on('message', function (data) {
      //    console.log(data);
      // });

      // socket.on('getAvailableRides', function (data) {
      //    console.log("getAvailableRides called")
      //    console.log(data);

      //    socket.emit('getAvailableRidesCallback', { data: "dataReceived" });

      // });

   });
}