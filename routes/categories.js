const express = require('express');
const util = require('util');
const categoriesRouter = express.Router();
const verifyToken = require("../functions/userVarification");

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);


categoriesRouter.post('/', verifyToken, (req, res) => {

    //destructuring request body
    const clientID = req.body.clientID;
    const userID = req.body.userID;
    const roleID = req.body.roleID;

    //Only Admins are allowed to add catergories
    if (roleID !== 1) res.status(403).json({ msg: "Sorry your are not authorized to add categories" });
    else {
        try {
            (async () => {
                //Create Local Category ID
                const SQL1 = `SELECT Categories FROM counters WHERE ClientID = ${clientID}`;
                let counter = await query(SQL1);
                counter = counter[0].Categories + 1;
                const localCategoryID = 'CT' + ('00' + counter).slice(-3);
                res.json({ Token: req.token, authData: req.authData })
            })()

        }
        catch(err) {
            res.status(500).json({msg: "Something went wrong"});
            return;
        }

    }

});

module.exports = categoriesRouter;