const express = require('express');
const customersRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const verifyParams = require('../functions/verifyParams');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);


customersRouter.post('/addcustomer', verifyToken, authorization([1]), (req, res) => {
    // Destructuring Request Body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const Name = req.body.Name;
    const Address = req.body.Address;
    const CNIC = req.body.CNIC;
    const CreditCustomer = req.body.CreditCustomer;
    const DOB = req.body.DOB;
    const Email = req.body.Email;
    const Gender = req.body.Gender;
    const PhoneNo = req.body.PhoneNo;

    (async () => {
        try {
            //SQL to Check if customer already exist for the client
            const SQL1 = `SELECT EXISTS(SELECT * FROM customers WHERE (Email = "${Email}" OR ContactNumber="${PhoneNo}") AND ClientID = ${clientID}) AS Count`;
            const customerCheck = await query(SQL1);
            if (customerCheck[0].Count) {
                res.status(400).json({ msg: 'Customer Already Exist With Provided Email or Phone Number' });
                return;
            }

            //Get Local Customer number
            const SQL2 = `SELECT COUNT(ClientID) AS 'Customers' FROM customers WHERE ClientID = ${clientID};`;
            let counter = await query(SQL2);
            counter = counter[0].Customers + 1;
            const localCustomerID = 'C' + ('000' + counter).slice(-4);

            //Adding customer, if not already exist
            const SQL3 = `INSERT INTO customers (CustomerID, LocalCustomerID, ClientID, CustomerName, Gender, Address, ContactNumber, Email, DOB, CNIC, CreditCustomer, Deleted) 
            VALUES (NULL, '${localCustomerID}', '${clientID}', '${Name}', '${Gender}', '${Address}', '${PhoneNo}', '${Email}', '${DOB}', '${CNIC}', ${CreditCustomer}, 'No')`;
            const addedCustomer = await query(SQL3);
                
            if(addedCustomer.affectedRows > 0) {
                res.status(200).json({ msg : "Customer have been added"});
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

customersRouter.get('/:clientID', verifyToken, verifyParams, (req, res) => {
    const clientID = req.params.clientID;
    (async () => {
        try {
            const SQL1 = `SELECT * FROM customers WHERE ClientID = ${clientID} AND Deleted = 'No'`;
            let customers = await query(SQL1);
            res.status(200).json(customers);
        }
        catch(err) {
            res.status(500).json({msg: "Something went wrong"});
        }

    })()
})

module.exports = customersRouter;