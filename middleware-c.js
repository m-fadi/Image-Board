// const multer = require("multer");
// const uidSafe = require("uid-safe");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: path.join(__dirname, "uploads"),
//     filename: (req, file, callback) => {
//         uidSafe(24).then((uid) => {
//             const extension = path.extname(file.originalname);
//             const newFileName = uid + extension;
//             callback(null, newFileName);
//         });
//     },
// });

// module.exports.uploader = multer({
//     storage,
//     limits: {
//         fileSize: 2097152,
//     },

// });
const aws = require("aws-sdk");

module.export.upload = (req, res, next) => {
    if (!req.file) {
        res.json({
            success: false,
            message: "File upload failed",
        });
    }
    console.log(req.file);
    const { filename, mimetype, size, path } = req.file;
    const { description, title, username } = req.body;
    imgPath = fs.createReadStream(path);
    imgUrl = `https://s3.amazonaws.com/${AWS_BUCKET_NAME}/${filename}`;
    // add a func fs.unlinkSync(filePath) to delete the image from uploads

    console.log("the file in Server", req.file);
    const promise = S3.putObject({
        Bucket: `${AWS_BUCKET_NAME}`,
        ACL: "public-read",
        Key: filename,
        Body: imgPath,
        ContentType: mimetype,
        ContentLength: size,
    }).promise();

    promise
        .then((result) => {
            console.log("success, the result of the promise from s3");
            console.log(result);
            // it worked!!!
            //return res.json();
            unlinkFile(req.file.path);
            next();
        })
        .then(() => {})
        .catch((err) => {
            // uh oh
            return res.sendStatus(500);
        });
};
