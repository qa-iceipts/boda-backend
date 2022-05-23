const Encryption = require('../')

app.post('/checkout-encryption', (req, res) => {
    const accessKey = "<YOUR_ACCESS_KEY>"
    const IVKey = "<YOUR_IV_KEY>";
    const secretKey = "<YOUR_SECRET_KEY>";
    const algorithm = "aes-256-cbc";

    // get the request body
    const requestBody = req.body;

    let encryption = new Encryption(IVKey, secretKey, algorithm)

    const payload = JSON
        .stringify(requestBody)
        .replace(/\//g, '\\/');

    console.log(`https://developer.tingg.africa/checkout/v2/express/?params=${encryption.encrypt(payload)}&accessKey=${accessKey}&countryCode=${requestBody.countryCode}`)
    // return a JSON response
    res.json({
        params: encryption.encrypt(payload),
        accessKey,
        countryCode: requestBody.countryCode
    });
});
s