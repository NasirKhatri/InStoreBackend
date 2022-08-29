const express = require('express');
const subscribeRouter = express.Router();
const util = require('util');
const bcrypt = require('bcrypt');

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
    var Password = req.body.Password;
    const PhoneNo = req.body.PhoneNo;
    const Voucher = req.body.Voucher;
    const Package = req.body.Package;
    const Gender = req.body.Gender;

    //Hashing Password to be store in DB
    const hash = bcrypt.hashSync(Password, 10);

    //Getting Dates
    var today = new Date();
    const RegistrationDate = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
    var ValidityDate = new Date(new Date().setDate(today.getDate() + 31));
    ValidityDate = ValidityDate.getFullYear() + '-' + ("0" + (ValidityDate.getMonth() + 1)).slice(-2) + '-' + ("0" + ValidityDate.getDate()).slice(-2);

    const SQLForClientExistanceCheck = `SELECT EXISTS(SELECT * FROM clients WHERE Email = '${Email}' OR PhoneNumber = '${PhoneNo}') AS 'Count'`;
    const SQlForClientRegistration = `INSERT INTO clients (ClientID, Name, Email, PhoneNumber, RegisteredOn, Package, ClientType, Validity)
                                      VALUES (NULL, '${Name}', '${Email}', '${PhoneNo}', '${RegistrationDate}', '${Package}', 'Regular', '${ValidityDate}')`;

    (async () => {
        try {
            const userCheck = await query(SQLForClientExistanceCheck);
            if (userCheck[0].Count) {
                res.status(400).json({ msg : 'User Already Exist With Provided Email or Phone Number'});
                return;
            }

            // Insert Client in DB
            const result = await query(SQlForClientRegistration);
            const SQLForUserRegistration = `INSERT INTO users (UserID, ClientID, Name, Gender, Email, PhoneNumber, Password, Address, DOB, CNIC, Active, LastUpdated, RoleID, LocalUserID) 
                                            VALUES (NULL, ${result.insertId}, '${Name}', '${Gender}', '${Email}', '${PhoneNo}', '${hash}', '${Address}', '${DOB}', '${CNIC}', 1, '${RegistrationDate}', 1, 'UR001')`;
            const SQLForPayment = `INSERT INTO payments (ClientID, PaymentDate, Voucher, Posted) 
                                        VALUES (${result.insertId}, '${RegistrationDate}', '${Voucher}', 'No')`;
            const user = await query(SQLForUserRegistration);
            const payment = await query(SQLForPayment);
            res.status(200).json({ msg : "You have been registered successfully"});
            return;
        }
        catch (err) {
            res.send(err);
            return;
        }
    })();
})

module.exports = subscribeRouter;