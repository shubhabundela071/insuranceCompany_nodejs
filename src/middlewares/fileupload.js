const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
require('./../global_functions');
require('./../global_constants');

aws.config.loadFromPath('src/middlewares/aws.json')

var s3 = new aws.S3();

//Local store
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderModule = req.params.module;
        cb(null, "public/user/Images");
    },
    filename: (req, file, cb) => {
        const filetype = file.mimetype.split("/")[1];
        cb(null, Date.now() + "." + filetype);
    }
});

var upload = multer({
    storage: storage,
    // fileFilter : multerFilter
});


//S3 image uplaoding
const UploadImages = (req, res) => {
    let uploadMultiple = upload.array("files");
    uploadMultiple(req, res, async err => {
        if (err) {
            console.log(err);
            return res.status(400).send(
                JSON.stringify({
                    message: "Files submission failed.",
                    image: []
                })
            );
        }
        req.files = await req.files.map(file => {
            return {
                url: file.location
            };
        });
        return res.status(201).send(
            JSON.stringify({
                message: "Files uploaded successfully.",
                image: req.files
            })
        );
    });
};


/**
   * Common function (Images and image upload)
   * mostly usering this function
*/

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "bucket-name",
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});

const deleteImages = function (filename) {
    var s3 = new aws.S3();
    var params = {
        Bucket: "event365-1",
        Delete: {
            filename
        }
    };
    s3.deleteObjects(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted");
        }
    });
}

module.exports = {
    upload,
    UploadImages,
    uploadS3,
    deleteImages,
};
