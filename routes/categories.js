const express = require('express');
const util = require('util');
const categoriesRouter = express.Router();
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const multer = require('multer');
const fs = require('fs');
var path = require('path');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);


// File Uploading through Multer
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./uploads/${req.body.clientID}/categories`;
        fs.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.clientID + "_" + "Category_" + file.originalname.replace(".", "_") + "_" + Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });

/*function authorization(req, res, next) {
    //Only Admins are allowed to add category
    const roleID = parseInt(req.authData.roleID);
    if (roleID !== 1) res.status(403).json({ msg: "Sorry your are not authorized to add categories" });
    else {
        next();
    }
}*/

categoriesRouter.post('/', verifyToken, (req, res, next) => authorization(req, res, next), upload.single('Image'), (req, res) => {

    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const name = req.body.Name;
    const branches = req.body.Branches;
    const color = req.body.Color;
    let imageSource = `uploads/${req.body.clientID}/categories/${req.file.filename}`;
    const imageInPOS = req.body.ImageInPOS;
    const visibilityInPOS = req.body.VisibilityInPOS;


    (async () => {
        try {
            //Create Local Category ID
            const SQL1 = `SELECT COUNT(ClientID) AS 'Categories' FROM categories WHERE ClientID = ${clientID};`;
            let counter = await query(SQL1);
            counter = counter[0].Categories + 1;
            const localCategoryID = 'CT' + ('00' + counter).slice(-3);

            //SQL for Adding Category in the database
            const SQL2 = `INSERT INTO categories (CategoryID, LocalCategoryID, ClientID, CategoryName, ShowInBranches, CategoryColor, ImageSrc, DisplayInPOS, DisplayImage) 
                VALUES (NULL, '${localCategoryID}', ${clientID}, '${name}', '${branches}', '${color}', '${imageSource}', ${visibilityInPOS}, ${imageInPOS})`;
            const addedCategory = await query(SQL2);

            if (addedCategory.affectedRows > 0) {
                res.status(200).json({ msg: "Category have been added" });
            }
            else {
                res.status(500).json({ msg: "Something went wrong" });
            }

        }
        catch (err) {
            res.status(500).json({ msg: "Something went wrong" });
            return;
        }

    })()


});

module.exports = categoriesRouter;