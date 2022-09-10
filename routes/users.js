const express = require('express');
const usersRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const bcrypt = require('bcrypt');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

usersRouter.post('/adduser', verifyToken, authorization, (req, res) => {

    //destructuring request body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const Active = req.body.Active;
    const Address = req.body.Address;
    const CNIC = req.body.CNIC;
    const ContactNumber = req.body.ContactNumber;
    const DOB = req.body.DOB;
    const Email = req.body.Email;
    const Gender = req.body.Gender;
    const Name = req.body.Name;
    const Password = req.body.Password;
    const UserRole = parseInt(req.body.UserRole);

    (async () => {
        try {
            //Check If user already exist with client with provided Email or Contact Number
            const SQL1 = `SELECT EXISTS(SELECT * FROM users WHERE (Email = '${Email}' OR PhoneNumber = '${ContactNumber}') AND ClientID = ${clientID}) AS 'Count'`;
            const userCheck = await query(SQL1);
            if (userCheck[0].Count) {
                res.status(400).json({ msg: 'User Already Exist With Provided Email or Phone Number' });
                return;
            }

            //Password hashing to be store in Database
            const hash = bcrypt.hashSync(Password, 10);

            //Generate local user ID
            const SQL2 = `SELECT COUNT(ClientID) AS 'Users' FROM users WHERE ClientID = ${clientID};`;
            let counter = await query(SQL2);
            counter = counter[0].Users + 1;
            const localUserID = 'UR' + ('00' + counter).slice(-3);

            //Get Today Date
            var today = new Date();
            const todayDate = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);

            //Add User in Database
            const SQL3 = `INSERT INTO users (UserID, ClientID, Gender, Email, PhoneNumber, Password, Address, DOB, CNIC, Active, LastUpdated, RoleID, LocalUserID, Name) 
            VALUES (NULL, ${clientID}, '${Gender}', '${Email}', '${ContactNumber}', '${hash}', '${Address}', '${DOB}', '${CNIC}', ${Active}, '${todayDate}', ${UserRole}, '${localUserID}', '${Name}')`;
            const addedUser = await query(SQL3);

            if (addedUser.affectedRows > 0) {
                res.status(200).json({ msg: "User have been added" });
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

module.exports = usersRouter;