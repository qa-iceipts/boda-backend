require('dotenv').config();
let a = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC+xVoPHJdO6fBn\nY2xfYKsGID7BGsRiMb5eAEPeBCn3xUTrJqEuXKM5dPINMwOuZahekTHZ4fg5pRIJ\nd2Hcc0cXRDzJejw64cfkSoJ9dohHH+3/oxdhj+TE5pBUcuiWeBN2mpnr1YT1RKKB\nr53+wEUb1SwxHNHOJ7I4EN16PCWNdYiOuApZrel6I6RGL/wUUB76FBJCY6eQJR6/\ntvmLoQXds5MWYGc09Cq/1ukmD+zVnD+WQ0TfyuKS/fs0kFv2gexNDhyV55Koi+6O\nJQmuMeGvABhL13YLl2AFF2UfsREyqoD33IFjQISHRFTxgS1ZmY8Bav2Vm9OmmGkV\nAWCl9sfDAgMBAAECgf93+aWp21FNT9LhMqX1VdY5BA5zY2IeXypZ89C6z+OU73to\nZ+L2RUxh1ipkIrEt/MDmuGmhnXt+xVGSooHpIpaTC1cvXrCCV3xfFnz6apFKKcqD\n+w25TcWSD261rY6ZEusqrBAhQSddGM0awlea31CXMHmaaYWJIW3z1Kd1OF5ll221\nm8glESwpwvurrDaFeUmsYTMMY7Iy3irQWV1OnVmw45bz8S3As5v7Y2oXppqbLB+w\nB3vHuFEYFITjUCT27FG2BZEVxRqnKC0qDV/721I9hAC9sftfR+kFypRPkARyMqmS\nCT8bmcNN9hmTPxzPXWHEim7hV2oG611jg1mRafkCgYEA9iFmTlV/kOHTmhqf5l/1\nxFQBjrLiUPxf1P7zGTitutnr5kUP7khleJJZ94o4ObjWpNQI1qxErgX8RbpUUIaG\nEkV2A3254oX43+4r8mavSrEuLfiKdKiw2u9Asdx3z4iHZVDDbICW/esebYKgt6yQ\nBr5hDSDNgwoPT4E/HavtBHUCgYEAxmurlj9A7BrNbBEUPrzNJFpHMDJYZyH6xLGi\nM43Q2zl2IrvMSbUYdKsbUdaSOEThEKVdI8V8gsJwCc0vRdQM5CbacGDJNp4vJ44e\nZSKSAV8SuKAakGJ7iV90v9IahgYEuW/s2dMBL06sao4gjwbpbQUmPbMtQB/69hsb\nuIMotFcCgYA+Mkh5CQ/4W6iuK4Y2oA8p8pSGK9wW3P+WgmqJ+BGmwwTippcU/sRt\niIYlkI8Ovw+2jUJChTvBwg9yy1gdFTFyEo106mN7w6EVbUk7swke1dE2mrTaL/qp\nCIaPq4e3MOgOCS+pDoGZXr3MrJLSd0/Z9Gfv+lcUgwlFbQK3C8gUNQKBgDMTaDnm\n0ml0hMh6pQF5TD09V/HaI9N4dbrIFv66VLb51aUfPnkCuubdXMz2NPFzGZRVXOJm\nZaSrNHfxb2fELAVW0wf2ghUjJvRBqyVRftAHjyQjYnMkRrSX88+k39r8FZ8+ZnOz\n0yxATjWnnE3084Vyu+NKCi3ljY5ob/xRFttFAoGBAKySqUu/6CFV7HpF5FyjCWkW\n/7se5t1RmLULfT0+AnoQLyKAKimZTTxSX7gW7/kANQeQriW5vbmfM371Q1iELSm2\nhuA2Fu/4e4S31mwwadPhjGIbxMswDIZ4b7n4uGw3FUrDofXlV7XStvdN+eLOxMVZ\nj5kCZk3FJ28TIGCuUHWu\n-----END PRIVATE KEY-----\n",
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url,
}
console.log("fbDATA>>>", a)
module.exports = {

    "firebase_config": a
    // {
    //     "type": process.env.type,
    //     "project_id": process.env.project_id,
    //     "private_key_id": process.env.private_key_id,
    //     "private_key": process.env.private_key,
    //     "client_email": process.env.client_email,
    //     "client_id": process.env.client_id,
    //     "auth_uri": process.env.auth_uri,
    //     "token_uri": process.env.token_uri,
    //     "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    //     "client_x509_cert_url": process.env.client_x509_cert_url,
    // }

}
// console.log(module.exports.firebase_config);