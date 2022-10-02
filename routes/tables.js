const express = require('express');
const tablesRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');

//Importing Database Connection
const db = require('../dbConnection');
const verifyParams = require('../functions/verifyParams');
const query = util.promisify(db.query).bind(db);


tablesRouter.post('/addtable', verifyToken, authorization([1]), (req, res) => {

    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const BranchID = req.body.Branch;
    const TableName = req.body.TableName;


    (async () => {

        try {
            //Create Local Table ID
            const SQL1 = `SELECT COUNT(ClientID) AS 'Tables' FROM tables WHERE ClientID = ${clientID};`;
            let counter = await query(SQL1);
            counter = counter[0].Tables + 1;
            const localTableID = 'TB' + ('00' + counter).slice(-3);

            //SQL for Adding Table in the database
            const SQL2 = `INSERT INTO tables (TableID, LocalTableID, ClientID, TableName, BranchID) 
                            VALUES (NULL, '${localTableID}', ${clientID}, '${TableName}', '${BranchID}')`;
            const addedTable = await query(SQL2);

            if (addedTable.affectedRows > 0) {
                res.status(200).json({ msg: "Table have been added" });
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

tablesRouter.get('/:clientID/branch/:branchID', verifyToken, verifyParams, (req, res) => {
    const clientID = req.params.clientID;
    const branchID = req.params.branchID;

    (async () => {
        try {
            const SQL1 = `SELECT * FROM tables WHERE ClientID = ${clientID} AND BranchID = ${branchID} AND Deleted = 'No'`;
            let tables = await query(SQL1);
            res.status(200).json(tables);
        }
        catch(err) {
            res.status(500).json({msg: "Something went wrong"});
        }

    })()
}) 

module.exports = tablesRouter;