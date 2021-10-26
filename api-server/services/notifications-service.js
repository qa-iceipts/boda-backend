const admin = require("../utils/firebase/firebase")
module.exports = {
    sendNotifications: function (message) {
        return new Promise(function (resolve, reject) {
            // Create a list containing up to 500 registration tokens.
            // These registration tokens come from the client FCM SDKs.
            // const registrationTokens = [
            //     'YOUR_REGISTRATION_TOKEN_1',
            //     // …
            //     'YOUR_REGISTRATION_TOKEN_N',
            // ];
            admin.messaging().sendMulticast(message)
                .then((response) => {
                    console.log(response.successCount + ' messages were sent successfully');
                    return resolve(response)
                }).catch(err => {
                    console.log(err)
                    return reject(err)
                });
        });
    }

    // sendNotifications: function (registrationTokens, notificationObj, notificationObj1DATA) {
    //     return new Promise(function (resolve, reject) {
    //         // Create a list containing up to 500 registration tokens.
    //         // These registration tokens come from the client FCM SDKs.
    //         // const registrationTokens = [
    //         //     'YOUR_REGISTRATION_TOKEN_1',
    //         //     // …
    //         //     'YOUR_REGISTRATION_TOKEN_N',
    //         // ];

    //         const message = {

    //             notification: notificationObj,
    //             data: {
    //                 click_action: "FLUTTER_NOTIFICATION_CLICK",
    //                 sound: "default",
    //                 status: "done",
    //                 screen: "screenA",
    //             },
    //             android: {
    //                 notification: {
    //                     click_action : notificationObj1DATA.click
    //                     // clickAction: 'rideclick'
    //                 }
    //             },
    //             data: notificationObj1DATA?notificationObj1DATA:"",
    //             tokens: registrationTokens,
    //         };

    //         admin.messaging().sendMulticast(message)
    //             .then((response) => {
    //                 console.log(response.successCount + ' messages were sent successfully');
    //                 return resolve(response)
    //             }).catch(err => {
    //                 console.log(err)
    //                 return reject(err)
    //             });
    //     });
    // }
}