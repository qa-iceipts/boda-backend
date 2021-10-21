require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const { v4: uuidv4 } = require('uuid')
const AWS_Bucket_Name = process.env.AWS_Bucket_Name
const AWS_Access_Key_ID = process.env.AWS_Access_Key_ID
const AWS_Secret_Access_ID = process.env.AWS_Secret_Access
const AWS_Cloudfront = process.env.AWS_Cloudfront
const AWS_REGION = process.env.AWS_REGION
const multerS3 = require('multer-s3')
const multer = require('multer')


// const s3 = new S3({
//     credentials: {
//         accessKeyId: AWS_Access_Key_ID,
//         secretAccessKey: AWS_Secret_Access_ID,
//         region: AWS_REGION
//     },
// });

const s3 = new S3({
    accessKeyId: AWS_Access_Key_ID,
    secretAccessKey: AWS_Secret_Access_ID,
    Bucket: AWS_Bucket_Name,
    region: AWS_REGION
});

//delete file
function deleteFile(key) {
    s3.deleteObject({ Bucket: AWS_Bucket_Name, Key: key }, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log("data::",data);
        return data
    });
}
exports.deleteFile = deleteFile

// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: AWS_Bucket_Name
    }
    s3.getObject(downloadParams, function(err,data){
        if (err) {
            console.log("Error", err);
          } else {
            console.log("getObject", data);
          }
    })
    
    return s3.getObject(downloadParams).createReadStream()
}

//list all buckets
const listBuckets = () => {
    s3.listBuckets(function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.Buckets);
        }
    });
}
const listObjectsInBucket = (bucketName) => {
    // Create the parameters for calling listObjects
    var bucketParams = {
        Bucket : bucketName,
    };
  
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}

const clearBucket = (bucket) => {
    // var self = this;
    console.log("clear Bucket :: Called")
    s3.listObjects({Bucket: bucket}, function (err, data) {
        if (err) {
            console.log("error listing bucket objects "+err);
            return;
        }
        var items = data.Contents;
        for (var i = 0; i < items.length; i += 1) {
           
            var deleteParams = {Bucket: bucket, Key: items[i].Key};
            // s3.deleteObject(client, deleteParams);

            s3.deleteObject(deleteParams, function(err, data) {
                if (err) console.log(err, err.stack);  // error
                else  console.log("deleted");                 // deleted
              });
        }
    });
}

// code for testing aws

// setTimeout(() => {
//     //  clearBucket('staging-bodadrop-common')
//     listObjectsInBucket('staging-bodadrop-common')
//     //  getFileStream("profile/2021-10-20T17:50:59.823Z2a1d10bb-03a8-42c5-a012-b09dc110aece-12329.jpg")
//     // deleteFile("profile/2021-10-20T17:33:26.071Zd713d9b9-dbcc-4be3-91cd-32feb001bd85-12329.jpg")
// }, 2000);


// whole new idea code with multer S3

// this is just to test locally if multer is working fine.
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './logs')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
// test locally ends

// file types check
const fileFilter = (req, file, cb) => {
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
        cb(null, req.subdir + new Date().toISOString() + uuidv4() + '-' + file.originalname)
    },
    contentDisposition: 'inline',
    // acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
});

const uploadFile = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})

exports.getFileStream = getFileStream
exports.uploadFile = uploadFile


