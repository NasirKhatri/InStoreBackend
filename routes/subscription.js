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
    const Package = req.body.Package;

    var today = new Date();
    const RegistrationDate = today.getFullYear()+'-'+("0" + (today.getMonth()+1)).slice(-2)+'-'+("0" + today.getDate()).slice(-2);
    var ValidityDate = new Date(new Date().setDate(today.getDate() + 31));
    ValidityDate = ValidityDate.getFullYear()+'-'+("0" + (ValidityDate.getMonth()+1)).slice(-2)+'-'+("0" + ValidityDate.getDate()).slice(-2);

    const SQLForClientExistanceCheck = `SELECT EXISTS(SELECT * FROM clients WHERE Email = '${Email}' OR PhoneNumber = '${PhoneNo}') AS 'Count'`;
    const SQlForClientRegistration = `INSERT INTO clients (ClientID, Name, Email, PhoneNumber, RegisteredOn, Package, ClientType, Validity)
                                      VALUES (NULL, '${Name}', '${Email}', '${PhoneNo}', '${RegistrationDate}', '${Package}', 'Regular', '${ValidityDate}')`;

    (async () => {
        try {
            const userCheck = await query(SQLForClientExistanceCheck);
            if (userCheck[0].Count) {
                res.status(400).send('User Already Exist');
                return;
            }
            const result = await query(SQlForClientRegistration);
            if(result.affectedRows === 1) {
                //To Be Continue From Here
                //
                //
                res.status(200).send(result);
                return;
            }
        }
        catch (err) {
            res.send(err);
            return;
        }
    })();
})

module.exports = subscribeRouter;