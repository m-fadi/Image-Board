const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT, AWS_BUCKET_NAME } = process.env;

const fs = require("fs");
const s3 = require("./s3");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
    getImage,
    insertImage,
    getImgById,
    insertComment,
    getCommentsById,
    getMoreImages,
} = require("./public/js/db");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.json());

/////// Route get, post/images //////////////////////////////////////

app.get("/images", (req, res) => {
    getImage().then((result) => {
        //console.log(" getImage result from db",result)
        return res.json(result);
    });
});

app.post("/image", upload.single("image"), s3.upload, (req, res) => {
    const { description, title, username } = req.body;
    const { filename } = req.file;
    imgUrl = `https://s3.amazonaws.com/${AWS_BUCKET_NAME}/${filename}`;
    insertImage({ imgUrl, description, title, username }).then((result) => {
        console.log("result inserted in server", result);
        res.json({
            success: true,
            data: result,
        });
    });
   
});
/////// Route images //////////////////////////////////////

app.get("/images/:id", (req, res) => {
    const imgId = req.params.id;
    //if (  imgId == isNaN) return res.redirect("/"); // why not working!!!!!!!!!!!?
    getImgById(imgId)
        .then((result) => {
            console.log("getImgById image data from db", result);
            //if (result === 0) return res.redirect("/");
            res.json(result);
        })
        .catch((err) => console.log("getImgById failed", err));
});

/////// Route comments //////////////////////////////////////
app.get("/images/comments/:id", (req, res) => {
    const imgId = req.params.id;
    getCommentsById(imgId)
        .then((result) => {
            //console.log(result)
            res.json(result);
        })
        .catch((err) => console.log("getImgById failed", err));
});
app.post("/images/comments", (req, res) => {
    const { username, comment, imageId } = req.body;
    insertComment({ username, comment, imageId }).then((result) =>
        res.json(result)
    );
});

//////////////////////Route loadmore////////////////////////////////
app.get("/moreImages/:id", (req, res) => {
    console.log("lastImage id", req.params);
    getMoreImages(req.params.id).then((result) => {
        return res.json(result);
    });
});

app.get("*", (req, res) => {
    console.log("path in /", req.body);
    //console.log("params", location.pathname);
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
