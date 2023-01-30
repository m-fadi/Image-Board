const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT, AWS_BUCKET_NAME } = process.env;
const { getImage, insertImage } = require("./db");
const { uploader } = require("./middleware-c");
const fs = require("fs");
const { S3 } = require("./s3");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.get("/images", (req, res) => {
    getImage().then((result) => {
        //console.log("result from db",result)
        return res.send(result);
    });
});

app.post("/image", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.json({
            success: false,
            message: "File upload failed",
        });
    }

    const { filename, mimetype, size, path } = req.file;
    const { description, title, username } = req.body;
    imgPath = fs.createReadStream(path);
    imgUrl = `https://s3.amazonaws.com/${AWS_BUCKET_NAME}/${filename}`;
    // add a func fs.unlinkSync(filePath) to delete the image from uploads
    insertImage({ imgUrl, description, title, username }).then(() => {
        //fs.unlinkSync(filePath)});
        //console.log(path.join(__dirname, "filename"));
    });

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
            return res.json();
        })
        .then(() => {})
        .catch((err) => {
            // uh oh
            console.log(err);
        });

    return res.json({
        success: true,
        message: "File uploaded ",
        url: `/${req.file.filename}`,
        description,
        title,
        username,
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
