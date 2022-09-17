const express = require('express');
const util = require('util');
const branchesRouter = express.Router();
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const verifyParams = require('../functions/verifyParams');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

branchesRouter.post('/addbranch', verifyToken, authorization([1]), (req, res) => {
    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const BranchName = req.body.BranchName;
    const BranchAddress = req.body.BranchAddress;
    const ContactNumber = req.body.ContactNumber;


    (async () => {
        try {
            //Create Local Branch ID
            const SQL1 = `SELECT COUNT(ClientID) AS 'Branches' FROM branches WHERE ClientID = ${clientID};`;
            let counter = await query(SQL1);
            counter = counter[0].Branches + 1;
            const localBranchID = 'BR' + ('00' + counter).slice(-3);

            //SQL for Adding Branch in the database
            const SQL2 = `INSERT INTO branches (BranchID, LocalBranchID, ClientID, BranchName, BranchAddress, ContactNumber) 
                            VALUES (NULL, '${localBranchID}', ${clientID}, '${BranchName}', '${BranchAddress}', '${ContactNumber}')`;
            const addedBranch = await query(SQL2);

            if (addedBranch.affectedRows > 0) {
                res.status(200).json({ msg: "Branch have been added" });
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

branchesRouter.get('/:clientID', verifyToken, verifyParams, (req, res) => {
    const clientID = req.params.clientID;
    (async () => {
        try {
            const SQL1 = `SELECT * FROM branches WHERE ClientID = ${clientID} AND Deleted = 'No'`;
            let branches = await query(SQL1);
            res.status(200).json(branches);
        }
        catch(err) {
            res.status(500).json({msg: "Something went wrong"});
        }

    })()
})

module.exports = branchesRouter;