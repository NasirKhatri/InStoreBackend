const express = require('express');
const ridersRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

// function authorization(req, res, next) {
//     //Only Admins are allowed to add category
//     const roleID = parseInt(req.authData.roleID);
//     if (roleID !== 1) res.status(403).json({ msg: "Sorry your are not authorized to add branches" });
//     else {
//         next();
//     }
// }

ridersRouter.post('/addrider', verifyToken, authorization, (req, res) => {

    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const Name = req.body.Name;
    const BranchID = req.body.Branch;
    const LicenseNumber = req.body.LicenseNumber;
    const ContactNumber = req.body.ContactNumber;
    const Active = req.body.Active;

    (async () => {

        try {
            //Check If rider already exist with client
            const SQL1 = `SELECT EXISTS(SELECT * FROM riders WHERE ContactNumber = '${ContactNumber}' AND ClientID = '${clientID}') AS 'Count'`;
            const riderCheck = await query(SQL1);
            if (riderCheck[0].Count) {
                res.status(400).json({ msg: 'Rider Already Exist With Provided Phone Number' });
                return;
            }

            //Create Local Rider ID
            const SQL2 = `SELECT COUNT(ClientID) AS 'Riders' FROM riders WHERE ClientID = ${clientID};`;
            let counter = await query(SQL2);
            counter = counter[0].Riders + 1;
            const localRiderID = 'RD' + ('00' + counter).slice(-3);

            //Add rider in the Database
            const SQL3 = `INSERT INTO riders (RiderID, LocalRiderID, ClientID, RiderName, LicenseNumber, ContactNumber, BranchID, Active, Deleted) 
            VALUES (NULL, '${localRiderID}', ${clientID}, '${Name}', '${LicenseNumber}', '${ContactNumber}', ${BranchID}, ${Active}, 'No')`;
            const addedRider = await query(SQL3);

            if (addedRider.affectedRows > 0) {
                res.status(200).json({ msg: "Rider have been added" });
            }
            else {
                res.status(500).json({ msg: "Something went wrong" });
            }

        }
        
        catch (err) {
            res.status(500).json({ msg: "Something went wrong" });
            return;
        }

    })();

});

module.exports = ridersRouter;