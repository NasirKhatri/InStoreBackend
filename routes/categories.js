const express = require('express');
const util = require('util');
const categoriesRouter = express.Router();
const verifyToken = require("../functions/userVarification");
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
        cb(null, req.body.clientID + "_" + "Category_" + file.originalname.replace(".", "_") +"_" + Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });

//Check if user is authorized to upload file



categoriesRouter.post('/', verifyToken, upload.single('Image'), (req, res) => {

    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const roleID = parseInt(req.body.roleID);
    let imageSource = `uploads/${req.body.clientID}/${req.file.filename}`;
    console.log(imageSource);


    //Only Admins are allowed to add catergories
    if (roleID !== 1) res.status(403).json({ msg: "Sorry your are not authorized to add categories" });
    else {
        try {
            (async () => {
                //Create Local Category ID
                const SQL1 = `SELECT Categories FROM counters WHERE ClientID = ${clientID}`;
                let counter = await query(SQL1);
                counter = counter[0]?.Categories + 1;
                const localCategoryID = 'CT' + ('00' + counter).slice(-3);
                res.json({ Token: req.token, authData: req.authData })
            })()

        }
        catch (err) {
            res.status(500).json({ msg: "Something went wrong" });
            return;
        }
    }
});

module.exports = categoriesRouter;