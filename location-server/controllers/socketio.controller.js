"use-strict";

const createHttpError = require("http-errors");
const {
  findOrCreateByUserId,
  getByUserId,
} = require("../services/userLocation.service");

exports = module.exports = function (io) {
  // when client connection with new connection
  io.on("connection", async function (socket) {
    if (!socket.handshake.query.userId || socket.handshake.query.userId == "") {
      socket.emit("error", { message: "pass userId" });
      socket.disconnect();
    }

    //joining the room
    socket.join(socket.handshake.query.userId);
    // connection Object
    socket.userObj = {
      socketId: socket.id,
      userId: socket.handshake.query.userId,
    };

    try {
      socket.emit("onconnect", {
        message: "welcome User",
        socketId: socket.id,
      });

      //Whenever someone disconnects this piece of code executed
      socket.on("disconnect", () => disconnectUser(socket));

      socket.on("postLocation", (data) => postLocation(data, socket, io));

      socket.on("getLocation", (data, callback) =>
        getLocation(data, callback, socket)
      );
    } catch (err) {
      handleError(err, socket);
    }
  });
};

// disconnect logic
async function disconnectUser(socket) {
  try {
    // console.log('A user disconnected', socket.userObj);
  } catch (err) {
    handleError(err, socket);
  }
}

function handleError(err, socket) {
  console.error("Socket Error => ", err);
  if (socket) {
    if (err.response && err.response.data && err.response.data.expose) {
      socket.emit("error", err.response.data);
    } else {
      socket.emit(err.eventName ? err.eventName : "error", {
        success: false,
        status: err.statusCode ? err.statusCode : 500,
        error: err.name,
        error_message: err.message,
      });
    }
  }
}

//saveLocation
async function postLocation(data, socket, io) {
  try {
    // console.log("in Post Location>>", data, socket.userObj)
    let [result, created] = await findOrCreateByUserId(data);
    if (!created) {
      result.set(data);
      result.save();
    }
    socket.emit("locResponse", { message: "location updated" });
    let customer = await getByUserId(data.user_id);
    await result.reload();
    if (result && result.customerId) {
      io.to(result.customerId).emit("driver-move", {
        location: {
          lat: data.lat,
          long: data.long,
          vehicle_type: data.vehicle_type,
          user_id: data.user_id,
          loc_heading: data.loc_heading,
        },
      });
    }
  } catch (err) {
    handleError(err, socket);
  }
}

async function getLocation(data, callback, socket) {
  try {
    let userLocation = await getByUserId(data.userId);
    callback({
      userLocation,
    });
  } catch (error) {
    handleError(error, socket);
  }
}
