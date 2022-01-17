const admin = require("../utils/firebase/firebase")
module.exports = {
    sendNotifications: async function (message) {

        // Create a list containing up to 500 registration tokens.
        // These registration tokens come from the client FCM SDKs.
        // const registrationTokens = [
        //     'YOUR_REGISTRATION_TOKEN_1',
        //     // …
        //     'YOUR_REGISTRATION_TOKEN_N',
        // ];
        let response = await admin.messaging().sendMulticast(message)
        console.log(response.successCount + ' messages were sent successfully');
        return response
    }
}