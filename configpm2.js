module.exports = {
    apps: [
        {
            name: "API-SERVER",
            script: "./boda-drop-api/api-server/app.js",
            watch: false,
            env: {
                NODE_ENV: "test",
                DEV_DB_USERNAME: "root",
                DEV_DB_PASSWORD: 'root',
                DEV_DB_DATABASE: 'boda_db',
                DEV_DB_HOST: '127.0.0.1',
                DEV_DB_DIALECT: 'mysql',
                DEV_DB_PORT: 3306,

                TEST_DB_USERNAME: 'admin',
                TEST_DB_PASSWORD: 'WjtENvUpVhsO',
                TEST_DB_DATABASE: 'boda_db',
                TEST_DB_HOST: 'bodadrop-staging.cbgfgq4echmw.af-south-1.rds.amazonaws.com',
                TEST_DB_DIALECT: 'mysql',
                TEST_DB_PORT: 3306,

                PROD_DB_USERNAME: "root",
                PROD_DB_PASSWORD: 'root',
                PROD_DB_DATABASE: 'boda_db',
                PROD_DB_HOST: '127.0.0.1',
                PROD_DB_DIALECT: 'mysql',
                PROD_DB_PORT: 3306,

                PORT: 8080,
                SECRET: "iceipts--9023<>",
                JWT_SECRET: 'iceipts-348237894<>@#$#@%@#$%#@%R@!#$FDvfdvgjksdfgk6464f651656dsafar268428bcnvjsdjvsi273hbdfk?>>>><<{}{"23df',
                JWT_REF_SECRET: "ksajdjaksjdk",
                JWT_SECRET_EXPIRY_SEC: 100000,
                JWT_TOKEN_ALGORITHM_TYPE: 'HS256',

                mpesa_consumer_key: "2aa54JZNGeUG8TZ282nzNAfTfVJ6hG4A",
                mpesa_consumer_secret: "ADsSjq3sNKSQFOIKs",
                mpesa_oauth_token_url: "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type:client_credentials",
                mpesa_lipa_na_mpesa_shortcode: 174379,
                mpesa_lipa_na_mpesa_passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
                mpesa_lipaNaMpesaOnline_url: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

                MAPS_API_KEY: "AIzaSyC4GOl7NvegMbyig1C2buVek5gPn5UXSnQ",
                type: "service_account",
                project_id: "boda-app-90859",
                private_key_id: "cdb1de34de8ebb5a43fb096bd9fc659905be679c",
                private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC+xVoPHJdO6fBn\nY2xfYKsGID7BGsRiMb5eAEPeBCn3xUTrJqEuXKM5dPINMwOuZahekTHZ4fg5pRIJ\nd2Hcc0cXRDzJejw64cfkSoJ9dohHH+3/oxdhj+TE5pBUcuiWeBN2mpnr1YT1RKKB\nr53+wEUb1SwxHNHOJ7I4EN16PCWNdYiOuApZrel6I6RGL/wUUB76FBJCY6eQJR6/\ntvmLoQXds5MWYGc09Cq/1ukmD+zVnD+WQ0TfyuKS/fs0kFv2gexNDhyV55Koi+6O\nJQmuMeGvABhL13YLl2AFF2UfsREyqoD33IFjQISHRFTxgS1ZmY8Bav2Vm9OmmGkV\nAWCl9sfDAgMBAAECgf93+aWp21FNT9LhMqX1VdY5BA5zY2IeXypZ89C6z+OU73to\nZ+L2RUxh1ipkIrEt/MDmuGmhnXt+xVGSooHpIpaTC1cvXrCCV3xfFnz6apFKKcqD\n+w25TcWSD261rY6ZEusqrBAhQSddGM0awlea31CXMHmaaYWJIW3z1Kd1OF5ll221\nm8glESwpwvurrDaFeUmsYTMMY7Iy3irQWV1OnVmw45bz8S3As5v7Y2oXppqbLB+w\nB3vHuFEYFITjUCT27FG2BZEVxRqnKC0qDV/721I9hAC9sftfR+kFypRPkARyMqmS\nCT8bmcNN9hmTPxzPXWHEim7hV2oG611jg1mRafkCgYEA9iFmTlV/kOHTmhqf5l/1\nxFQBjrLiUPxf1P7zGTitutnr5kUP7khleJJZ94o4ObjWpNQI1qxErgX8RbpUUIaG\nEkV2A3254oX43+4r8mavSrEuLfiKdKiw2u9Asdx3z4iHZVDDbICW/esebYKgt6yQ\nBr5hDSDNgwoPT4E/HavtBHUCgYEAxmurlj9A7BrNbBEUPrzNJFpHMDJYZyH6xLGi\nM43Q2zl2IrvMSbUYdKsbUdaSOEThEKVdI8V8gsJwCc0vRdQM5CbacGDJNp4vJ44e\nZSKSAV8SuKAakGJ7iV90v9IahgYEuW/s2dMBL06sao4gjwbpbQUmPbMtQB/69hsb\nuIMotFcCgYA+Mkh5CQ/4W6iuK4Y2oA8p8pSGK9wW3P+WgmqJ+BGmwwTippcU/sRt\niIYlkI8Ovw+2jUJChTvBwg9yy1gdFTFyEo106mN7w6EVbUk7swke1dE2mrTaL/qp\nCIaPq4e3MOgOCS+pDoGZXr3MrJLSd0/Z9Gfv+lcUgwlFbQK3C8gUNQKBgDMTaDnm\n0ml0hMh6pQF5TD09V/HaI9N4dbrIFv66VLb51aUfPnkCuubdXMz2NPFzGZRVXOJm\nZaSrNHfxb2fELAVW0wf2ghUjJvRBqyVRftAHjyQjYnMkRrSX88+k39r8FZ8+ZnOz\n0yxATjWnnE3084Vyu+NKCi3ljY5ob/xRFttFAoGBAKySqUu/6CFV7HpF5FyjCWkW\n/7se5t1RmLULfT0+AnoQLyKAKimZTTxSX7gW7/kANQeQriW5vbmfM371Q1iELSm2\nhuA2Fu/4e4S31mwwadPhjGIbxMswDIZ4b7n4uGw3FUrDofXlV7XStvdN+eLOxMVZ\nj5kCZk3FJ28TIGCuUHWu\n-----END PRIVATE KEY-----\n",
                client_email: "firebase-adminsdk-fluaz@boda-app-90859.iam.gserviceaccount.com",
                client_id: "109275669175694469693",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fluaz%40boda-app-90859.iam.gserviceaccount.com",

                AWS_Bucket_Name: "staging-bodadrop-common",
                AWS_Access_Key_ID: "AKIAYDH747QC5VZGNXAH",
                AWS_Secret_Access: "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",
                AWS_Cloudfront: "https://d3aqd0lttt7b0w.cloudfront.net/",
                AWS_REGION: "af-south-1",
            }
        },

        {
            name: "DNS-SERVER",
            script: "./boda-drop-api/dns-server/app.js",
            watch: false,
            env: {
                NODE_ENV: "test",

                DEV_DB_USERNAME: "root",
                DEV_DB_PASSWORD: "root",
                DEV_DB_DATABASE: "boda_dns_db",
                DEV_DB_HOST: "127.0.0.1",
                DEV_DB_DIALECT: "mysql",


                PROD_DB_USERNAME: "root",
                PROD_DB_PASSWORD: "root",
                PROD_DB_DATABASE: "boda_dns_db",
                PROD_DB_HOST: "127.0.0.1",
                PROD_DB_DIALECT: "mysql",

                TEST_DB_USERNAME: 'admin',
                TEST_DB_PASSWORD: 'WjtENvUpVhsO',
                TEST_DB_DATABASE: 'boda_dns_db',
                TEST_DB_HOST: 'bodadrop-staging.cbgfgq4echmw.af-south-1.rds.amazonaws.com',
                TEST_DB_DIALECT: 'mysql',
                TEST_DB_PORT: 3306,

                JWT_SECRET: 'ijhfkjashkjfhueiwhiubnszdbnsbd<>@#$#@%@#$%#@%R@!#$FDvfdvgjksdfgk6464f651656dsafar268428bcnvjsdjvsi273hbdfk?>>>><<{}{"23df>>ASdj',
                JWT_REF_SECRET: "ksajdjaksjdk",
                JWT_SECRET_EXPIRY_SEC: 100000,
                JWT_TOKEN_ALGORITHM_TYPE: 'HS256',
                PORT: 4200,
                SECRET: "ansdkjheurhu--9023<>",


                LOCATION_SERVER: "http://localhost:4000/location",
                API_SERVER: "http://localhost:8080/api",

                MAPS_API_KEY: "AIzaSyC4GOl7NvegMbyig1C2buVek5gPn5UXSnQ",

                type: "service_account",
                project_id: "boda-app-90859",
                private_key_id: "cdb1de34de8ebb5a43fb096bd9fc659905be679c",
                private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC+xVoPHJdO6fBn\nY2xfYKsGID7BGsRiMb5eAEPeBCn3xUTrJqEuXKM5dPINMwOuZahekTHZ4fg5pRIJ\nd2Hcc0cXRDzJejw64cfkSoJ9dohHH+3/oxdhj+TE5pBUcuiWeBN2mpnr1YT1RKKB\nr53+wEUb1SwxHNHOJ7I4EN16PCWNdYiOuApZrel6I6RGL/wUUB76FBJCY6eQJR6/\ntvmLoQXds5MWYGc09Cq/1ukmD+zVnD+WQ0TfyuKS/fs0kFv2gexNDhyV55Koi+6O\nJQmuMeGvABhL13YLl2AFF2UfsREyqoD33IFjQISHRFTxgS1ZmY8Bav2Vm9OmmGkV\nAWCl9sfDAgMBAAECgf93+aWp21FNT9LhMqX1VdY5BA5zY2IeXypZ89C6z+OU73to\nZ+L2RUxh1ipkIrEt/MDmuGmhnXt+xVGSooHpIpaTC1cvXrCCV3xfFnz6apFKKcqD\n+w25TcWSD261rY6ZEusqrBAhQSddGM0awlea31CXMHmaaYWJIW3z1Kd1OF5ll221\nm8glESwpwvurrDaFeUmsYTMMY7Iy3irQWV1OnVmw45bz8S3As5v7Y2oXppqbLB+w\nB3vHuFEYFITjUCT27FG2BZEVxRqnKC0qDV/721I9hAC9sftfR+kFypRPkARyMqmS\nCT8bmcNN9hmTPxzPXWHEim7hV2oG611jg1mRafkCgYEA9iFmTlV/kOHTmhqf5l/1\nxFQBjrLiUPxf1P7zGTitutnr5kUP7khleJJZ94o4ObjWpNQI1qxErgX8RbpUUIaG\nEkV2A3254oX43+4r8mavSrEuLfiKdKiw2u9Asdx3z4iHZVDDbICW/esebYKgt6yQ\nBr5hDSDNgwoPT4E/HavtBHUCgYEAxmurlj9A7BrNbBEUPrzNJFpHMDJYZyH6xLGi\nM43Q2zl2IrvMSbUYdKsbUdaSOEThEKVdI8V8gsJwCc0vRdQM5CbacGDJNp4vJ44e\nZSKSAV8SuKAakGJ7iV90v9IahgYEuW/s2dMBL06sao4gjwbpbQUmPbMtQB/69hsb\nuIMotFcCgYA+Mkh5CQ/4W6iuK4Y2oA8p8pSGK9wW3P+WgmqJ+BGmwwTippcU/sRt\niIYlkI8Ovw+2jUJChTvBwg9yy1gdFTFyEo106mN7w6EVbUk7swke1dE2mrTaL/qp\nCIaPq4e3MOgOCS+pDoGZXr3MrJLSd0/Z9Gfv+lcUgwlFbQK3C8gUNQKBgDMTaDnm\n0ml0hMh6pQF5TD09V/HaI9N4dbrIFv66VLb51aUfPnkCuubdXMz2NPFzGZRVXOJm\nZaSrNHfxb2fELAVW0wf2ghUjJvRBqyVRftAHjyQjYnMkRrSX88+k39r8FZ8+ZnOz\n0yxATjWnnE3084Vyu+NKCi3ljY5ob/xRFttFAoGBAKySqUu/6CFV7HpF5FyjCWkW\n/7se5t1RmLULfT0+AnoQLyKAKimZTTxSX7gW7/kANQeQriW5vbmfM371Q1iELSm2\nhuA2Fu/4e4S31mwwadPhjGIbxMswDIZ4b7n4uGw3FUrDofXlV7XStvdN+eLOxMVZ\nj5kCZk3FJ28TIGCuUHWu\n-----END PRIVATE KEY-----\n",
                client_email: "firebase-adminsdk-fluaz@boda-app-90859.iam.gserviceaccount.com",
                client_id: "109275669175694469693",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fluaz%40boda-app-90859.iam.gserviceaccount.com",


            }
        },

        {
            name: "LOCATION-SERVER",
            script: "./boda-drop-api/location-server/app.js",
            watch: false,
            env: {
                NODE_ENV: "test",

                DEV_DB_USERNAME: "root",
                DEV_DB_PASSWORD: "root",
                DEV_DB_DATABASE: "boda_location_db",
                DEV_DB_HOST: "127.0.0.1",
                DEV_DB_DIALECT: "mysql",

                PROD_DB_USERNAME: "root",
                PROD_DB_PASSWORD: "root",
                PROD_DB_DATABASE: "boda_location_db",
                PROD_DB_HOST: "127.0.0.1",
                PROD_DB_DIALECT: "mysql",

                TEST_DB_USERNAME: 'admin',
                TEST_DB_PASSWORD: 'WjtENvUpVhsO',
                TEST_DB_DATABASE: 'boda_dns_db',
                TEST_DB_HOST: 'bodadrop-staging.cbgfgq4echmw.af-south-1.rds.amazonaws.com',
                TEST_DB_DIALECT: 'mysql',
                TEST_DB_PORT: 3306,

                JWT_SECRET: 'ijhfkjashkjfhueiwhiubnszdbnsbd<>@#$#@%@#$%#@%R@!#$FDvfdvgjksdfgk6464f651656dsafar268428bcnvjsdjvsi273hbdfk?>>>><<{}{"23df>>ASdj',
                JWT_REF_SECRET: "ksajdjaksjdk",
                JWT_SECRET_EXPIRY_SEC: 100000,
                JWT_TOKEN_ALGORITHM_TYPE: 'HS256',

                PORT: 4000,
                SECRET: "ansdkjheurhu--9023<>",

                MAPS_API_KEY: "AIzaSyC4GOl7NvegMbyig1C2buVek5gPn5UXSnQ",

            }
        },

    ]
}