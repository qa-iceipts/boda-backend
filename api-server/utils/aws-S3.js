require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const {v4 : uuidv4} = require('uuid')
const AWS_Bucket_Name = process.env.AWS_Bucket_Name
const AWS_Access_Key_ID = process.env.AWS_Access_Key_ID
const AWS_Secret_Access_ID = process.env.AWS_Secret_Access
const AWS_Cloudfront = process.env.AWS_Cloudfront
const AWS_REGION = process.env.AWS_REGION
var multerS3 = require('multer-s3')
const multer = require('multer')
// const s3 = new S3({
//     AWS_Access_Key_ID,
//     AWS_REGION,
//     AWS_Secret_Access_ID
// })
const s3 = new S3({
    credentials: {
        accessKeyId: AWS_Access_Key_ID,
        secretAccessKey: AWS_Secret_Access_ID,
        region : AWS_REGION
    },
});

const s3Config = new S3({
  accessKeyId: AWS_Access_Key_ID,
  secretAccessKey: AWS_Secret_Access_ID,
  Bucket: AWS_Bucket_Name
});

function deleteFile(key) {
s3.deleteObject({ Bucket: AWS_Bucket_Name, Key: key }, (err, data) => {
    if(err){
        console.log(err)
    }
    console.error(data);
    return data
});
}
exports.deleteFile = deleteFile
  
  
// uploads a file to s3
function uploadFile(dest,file) {
    // const fileStream = fs.createReadStream(file.path)
    let myFile = file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const uploadParams = {
      Bucket: AWS_Bucket_Name,
      Body: file.buffer,
      Key: dest + file.originalname,
      ContentType: file.mimetype,
    //   ACL: 'public-read'
    }
    // s3.upload(params, (error, data) => {
    //     if(error){
    //         res.status(500).send(error)
    //     }

    //     res.status(200).send(data)
    // })
    // return s3.upload(uploadParams).promise()
  }
  exports.uploadFile = uploadFile
  
  
  // downloads a file from s3
  function getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }



//   whole new idea code with multer S3
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        
        cb(null, true)
    } else {
        req.file_error = "image not allowed"
        cb(null, false)
    }

}

// this is just to test locally if multer is working fine.
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './logs')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const multerS3Config = multerS3({
    s3: s3Config,
    bucket: AWS_Bucket_Name,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        console.log(file)
        cb(null,req.subdir + new Date().toISOString() + uuidv4() + '-' + file.originalname)
    },
    contentDisposition: 'inline',
    contentType: multerS3.AUTO_CONTENT_TYPE,
});

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})

exports.profileImage = upload;
  exports.getFileStream = getFileStream
  exports.uploadFile = uploadFile


  