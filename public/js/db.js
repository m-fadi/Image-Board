const spicedPg = require("spiced-pg");
require("dotenv").config();

const db = spicedPg(
    `postgres:${process.env.USER}:${process.env.PASS}@localhost:5432/${process.env.DATABASE}`
);

///////////////Image handling///////////////////////////////
const getImage = () => {
    return db
        .query("SELECT * FROM images order by created_at DESC  LIMIT 4;")
        .then((result) => result.rows);
};

const getImgById = (imgId) => {
    return db
        .query("SELECT * FROM images where id=$1", [imgId])
        .then((result) => {
            //console.log(result)
            if (result.rowCount === 0) return 0;
            return result.rows[0];
        });
};

function insertImage({ imgUrl, description, title, username }) {
    return db
        .query(
            `INSERT INTO images (url,description, title, username)
            VALUES ($1, $2, $3,$4)
            RETURNING *`,
            [imgUrl, description, title, username]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => {
            console.log(error);
        });
}

const getMoreImages = (lastId) => {
    return db
        .query(
            `SELECT *,
    (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" 
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 4`,
            [lastId]
        )
        .then((result) => {
            return result.rows;
        });
};

///////////////Comment handling/////////////////////////////
function insertComment({ username, comment, imageId }) {
    return db
        .query(
            `INSERT INTO comments (username,comment,img_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [username, comment, imageId]
        )
        .then((result) => {
            //console.log("img data in comments table", result.rows[0]);
            return result.rows[0];
        })
        .catch((error) => {
            console.log(error);
        });
}

const getCommentsById = (imgId) => {
    return db
        .query(
            "SELECT * FROM comments where img_id=$1 order by created_at DESC",
            [imgId]
        )
        .then((result) => {
            //console.log("comments data in db", result.rows);
            return result.rows;
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = {
    getImage,
    insertImage,
    getImgById,
    insertComment,
    getCommentsById,
    getMoreImages,
};
