const express = require('express');
const util = require('util');
const branchesRouter = express.Router();
const verifyToken = require("../functions/userVarification");

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

function authorization(req, res, next) {
    //Only Admins are allowed to add category
    const roleID = parseInt(req.authData.roleID);
    if (roleID !== 1) res.status(403).json({ msg: "Sorry your are not authorized to add branches" });
    else {
        next();
    }
}

branchesRouter.post('/', verifyToken, authorization, (req, res) => {
    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const BranchName = req.body.BranchName;
    const BranchAddress = req.body.BranchAddress;
    const ContactNumber = req.body.ContactNumber;

    try {
        (async () => {
            //Create Local Branch ID
            const SQL1 = `SELECT COUNT(ClientID) AS 'Branches' FROM branches WHERE ClientID = ${clientID};`;
            let counter = await query(SQL1);
            counter = counter[0].Branches + 1;
            const localBranchID = 'BR' + ('00' + counter).slice(-3);

            //SQL for Adding Category in the database
            const SQL2 = `INSERT INTO branches (BranchID, LocalBranchID, ClientID, BranchName, BranchAddress, ContactNumber) 
                            VALUES (NULL, '${localBranchID}', ${clientID}, '${BranchName}', '${BranchAddress}', '${ContactNumber}')`;
            const addedBranch = await query(SQL2);

            if(addedBranch.affectedRows > 0) {
                res.status(200).json({ msg : "Branch have been added"});
            }
            else {
                res.status(500).json({ msg: "Something went wrong" });   
            }

        })()
    }
    catch (err) {
        res.status(500).json({ msg: "Something went wrong" });
        return;
    }
});

module.exports = branchesRouter;