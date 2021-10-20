const admin = require("../utils/firebase")
module.exports = {
    sendNotifications: function (registrationTokens,notificationObj) {
        return new Promise(function (resolve, reject) {
            // Create a list containing up to 500 registration tokens.
            // These registration tokens come from the client FCM SDKs.
            // const registrationTokens = [
            //     'YOUR_REGISTRATION_TOKEN_1',
            //     // …
            //     'YOUR_REGISTRATION_TOKEN_N',
            // ];
            
            const message = {
               
                notification: notificationObj,
                data: {
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                    sound: "default", 
                    status: "done",
                    screen: "screenA",
                  },
                //  {
                //     title: "SALE IS LIVE",
                //     body : "Shop your favourites now",
                //     // click_action: "http://localhost:3000/",
                //     // icon: "http://url-to-an-icon/icon.png"
                // },
                android: {
                    notification: {
                      clickAction: 'pickupRequests_intent'
                    }
                  },
                //   apns: {
                //     payload: {
                //       aps: {
                //         'category': 'INVITE_CATEGORY'
                //       }
                //     }
                //   },
                //   webpush: {
                //     fcmOptions: {
                //       link: 'www.amazon.in'
                //     }
                //   },
                data: notificationObj,
                tokens: registrationTokens,
            };

            admin.messaging().sendMulticast(message)
                .then((response) => {
                    console.log(response.successCount + ' messages were sent successfully');
                    return resolve(response)
                }).catch(err=>{
                    console.log(err)
                    return reject(err)
                });
        });
    }
}