const admin = require("../utils/firebase")
module.exports = {
    sendNotifications: async function (message) {
        let response = await admin.messaging().sendMulticast(message)
        console.log(response.successCount + ' messages were sent successfully');
        return response
    }
}