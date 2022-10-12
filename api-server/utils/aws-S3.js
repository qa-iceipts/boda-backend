// .env
require('dotenv').config()
// S3 & uuid require
const aws = require('aws-sdk')
const S3 = require('aws-sdk/clients/s3')
const { v4: uuidv4 } = require('uuid')
const multerS3 = require('multer-s3')
const multer = require('multer')
const { AWS_Bucket_Name, AWS_Access_Key_ID, AWS_Secret_Access, AWS_REGION } = process.env

// initialize S3 object
// const s3 = new S3({
//     // accessKeyId: AWS_Access_Key_ID,
//     // secretAccessKey: AWS_Secret_Access,
//     // // Bucket: AWS_Bucket_Name,
//     // region: AWS_REGION
// });


// aws.config.update({
//     accessKeyId: AWS_Access_Key_ID,
//     secretAccessKey: AWS_Secret_Access,
//     region: AWS_REGION,
//     bucket: AWS_Bucket_Name,
//     // endpoint: "http://testboda.s3.amazonaws.com"
// });
// const s3 = new aws.S3()

console.log({
    accessKeyId: AWS_Access_Key_ID,
    secretAccessKey: AWS_Secret_Access,
    bucket: AWS_Bucket_Name,
    // region: AWS_REGION
})

aws.config.update({
    apiVersion: 'latest',
    credentials: {
        accessKeyId: AWS_Access_Key_ID,
        secretAccessKey: AWS_Secret_Access
    }
});
// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint("https://fra1.digitaloceanspaces.com");
const s3 = new aws.S3({
    endpoint: spacesEndpoint
});


//delete file with Key
function deleteFile(key) {
    s3.deleteObject({ Bucket: AWS_Bucket_Name, Key: key }, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log("data::", data);
        return data
    });
}

async function getImage() {
    const data = s3.getObject(
        {
            Bucket: AWS_Bucket_Name,
            Key: 'your stored image'
        }

    ).promise();
    return data;
}
async function getUrl(myKey) {
    return s3.getSignedUrlPromise('getObject', {
        Bucket: AWS_Bucket_Name,
        Key: myKey,
        Expires: 60 * 5
    });
}


// whole new idea code with multer S3

// this is just to test locally if multer is working fine.
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
// test locally ends

// file types check
const fileFilter = (req, file, cb) => {
    console.log("filefilter", file)
    console.log({
        accessKeyId: AWS_Access_Key_ID,
        secretAccessKey: AWS_Secret_Access,
        bucket: AWS_Bucket_Name,
        // region: AWS_REGION
    })
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        req.file_error = "image not allowed"
        cb(null, false)
    }

}
// multerS3 configurations
const multerS3Config = multerS3({
    s3: s3,
    bucket: AWS_Bucket_Name,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        console.log("filedetails", file)
        cb(null, req.subdir + new Date().toISOString() + uuidv4() + '-' + file.originalname)
    },
    contentDisposition: 'inline',
    //acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
});

const uploadFile = multer({
    storage: multerS3Config,//multer.buffer,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})
// // old Code starts

// // downloads a file from s3
// function getFileStream(fileKey) {
//     const downloadParams = {
//         Key: fileKey,
//         Bucket: AWS_Bucket_Name
//     }
//     s3.getObject(downloadParams, function (err, data) {
//         if (err) {
//             console.log("Error", err);
//         } else {
//             console.log("getObject", data);
//         }
//     })

//     return s3.getObject(downloadParams).createReadStream()
// }

// //list all buckets
// const listBuckets = () => {
//     s3.listBuckets(function (err, data) {
//         if (err) {
//             console.log("Error", err);
//         } else {
//             console.log("Success", data.Buckets);
//         }
//     });
// }
// const listObjectsInBucket = (bucketName) => {
//     // Create the parameters for calling listObjects
//     var bucketParams = {
//         Bucket: bucketName,
//     };

//     // Call S3 to obtain a list of the objects in the bucket
//     s3.listObjects(bucketParams, function (err, data) {
//         if (err) {
//             console.log("Error", err);
//         } else {
//             console.log("Success", data);
//         }
//     });
// }
// // listObjectsInBucket("testboda")
// const clearBucket = (bucket) => {
//     // var self = this;
//     console.log("clear Bucket :: Called")
//     s3.listObjects({ Bucket: bucket }, function (err, data) {
//         if (err) {
//             console.log("error listing bucket objects " + err);
//             return;
//         }
//         var items = data.Contents;
//         for (var i = 0; i < items.length; i += 1) {

//             var deleteParams = { Bucket: bucket, Key: items[i].Key };
//             // s3.deleteObject(client, deleteParams);

//             s3.deleteObject(deleteParams, function (err, data) {
//                 if (err) console.log(err, err.stack);  // error
//                 else console.log("deleted");                 // deleted
//             });
//         }
//     });
// }
// // old code ends


module.exports = {
    deleteFile,
    uploadFile,
    getImage,
    getUrl
}




