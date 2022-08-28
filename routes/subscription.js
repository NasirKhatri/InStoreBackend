const express = require('express');
const subscribeRouter = express.Router();
const util = require('util');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

subscribeRouter.post('/', (req, res) => {
    // Destructuring Request Body
    const Address = req.body.Address;
    const CNIC = req.body.CNIC;
    const DOB = req.body.DOB;
    const Email = req.body.Email;
    const Name = req.body.Name;
    const Password = req.body.Password;
    const PhoneNo = req.body.PhoneNo;
    const RetypePassword = req.body.RetypePassword;
    const Voucher = req.body.Voucher;

    //SQL for checking if the requested email or phonenumber already exist
    const SQLForClientExistanceCheck = `SELECT EXISTS(SELECT * FROM clients WHERE Email = '${Email}' OR PhoneNumber = '${PhoneNo}') AS 'Count'`;

    (async () => {
        try {
            const userCheck = await query(SQLForClientExistanceCheck);
            if(userCheck[0].Count) {
                res.status(400).send('User Already Exist');
                return;
            }
            res.send(userCheck);
            return;
        }
        catch (err) {
            res.send(err);
        }
    })();
})

module.exports = subscribeRouter;