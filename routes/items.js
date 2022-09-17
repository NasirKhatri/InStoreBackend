const express = require('express');
const itemsRouter = express.Router();
const util = require('util');
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
        const path = `./uploads/${parseInt(req.body.clientID)}/items`;
        fs.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, parseInt(req.body.clientID) + "_" + "Item_" + file.originalname.replace(".", "_") + "_" + Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });

itemsRouter.post('/additem', verifyToken, authorization, upload.single('Image'), (req, res) => {

        //destructuring request body
        const clientID = parseInt(req.body.clientID);
        const userID = parseInt(req.body.userID);
        const name = req.body.Name;
        let imageSource = `uploads/${clientID}/items/${req.file.filename}`;
        const imageInPOS = req.body.ImageInPOS;
        const visibilityInPOS = req.body.VisibilityInPOS;
        const categoryID = parseInt(req.body.Category);
        const discount = req.body.Discount ? parseFloat(req.body.Discount) : 0;
        const saleRate = parseFloat(req.body.SalesRate);
        const taxID = parseInt(req.body.TaxType);
        const netPrice  = parseFloat(req.body.NetPrice);
        const uom = req.body.UOM;

        (async () => {
            try {
                //Create Local Item ID
                const SQL1 = `SELECT COUNT(ClientID) AS 'Items' FROM items WHERE ClientID = ${clientID};`;
                let counter = await query(SQL1);
                counter = counter[0].Items + 1;
                const localItemID = 'IT' + ('00' + counter).slice(-3);

                //Add Item in The Database
                const SQL2 = `INSERT INTO items (ItemID, LocalItemID, ClientID, CategoryID, UOM, SalesPrice, Discount, TaxID, NetPrice, ImageSrc, DisplayInPOS, DisplayImage, ItemName)
                 VALUES (NULL, '${localItemID}', ${clientID}, ${categoryID}, '${uom}', ${saleRate}, ${discount}, ${taxID}, ${netPrice}, '${imageSource}', ${visibilityInPOS}, ${imageInPOS}, '${name}')`;
                 const addedItem = await query(SQL2);

                 if (addedItem.affectedRows > 0) {
                     res.status(200).json({ msg: "Item have been added" });
                 }
                 else {
                     res.status(500).json({ msg: "Something went wrong" });
                 }

            }
            catch(err) {
                console.log(err);
                res.status(500).json({ msg: "Something went wrong" });
                return;
            }
        })();
});

module.exports = itemsRouter;