const express = require('express');
const taxtypesRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const verifyParams = require('../functions/verifyParams');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

taxtypesRouter.post('/addtaxtype', verifyToken, authorization([1]), (req, res) => {

    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const CalculationType = req.body.CalculationType;
    const TaxName = req.body.TaxName;
    const TaxRate = req.body.TaxRate;

    (async () => {

        try {
            //Create Local Tax ID
            const SQL1 = `SELECT COUNT(ClientID) AS 'Taxes' FROM taxtypes WHERE ClientID = ${clientID}`;
            let counter = await query(SQL1);
            counter = counter[0].Taxes + 1;
            const localTaxTypeID = 'TX' + ('00' + counter).slice(-3);

            //SQL for Adding Table in the database
            const SQL2 = `INSERT INTO taxtypes (TaxTypeID, LocalTaxTypeID, ClientID, TaxName, TaxRate, TaxBfrDisc, Deleted) 
            VALUES (NULL, '${localTaxTypeID}', ${clientID}, '${TaxName}', ${TaxRate}, ${CalculationType}, 'No')`;
            const addedTaxType = await query(SQL2);

            if (addedTaxType.affectedRows > 0) {
                res.status(200).json({ msg: "Tax Type have been added" });
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


taxtypesRouter.get('/:clientID', verifyToken, verifyParams, (req, res) => {
    const clientID = req.params.clientID;
    (async () => {
        try {
            const SQL1 = `SELECT * FROM taxtypes WHERE ClientID = ${clientID} AND Deleted = 'No'`;
            let taxtypes = await query(SQL1);
            res.status(200).json(taxtypes);
        }
        catch(err) {
            res.status(500).json({msg: "Something went wrong"});
        }

    })()
})

module.exports = taxtypesRouter;