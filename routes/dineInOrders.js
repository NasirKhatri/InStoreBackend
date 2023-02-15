const express = require('express');
const dineInOrdersRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const verifyParams = require('../functions/verifyParams');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

dineInOrdersRouter.post('/:clientID/:branchID/:tableID', verifyToken, authorization([1, 2, 5, 7]), verifyParams, (req, res) => { 
    //users with role Admin, All and Waiter are allowed to access this route

    //Destructuring the Request Body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const roleID = parseInt(req.body.roleID);

    const itemDetails = req.body.itemDetails;
    const noOfProducts = req.body.products;
    const noOfItems = req.body.itemsQty;
    const grossPrice = req.body.subTotal;
    const lineItemDiscount = req.body.itemDisc;
    const taxAmount = req.body.taxAmount;
    const saleTypeID = parseInt(req.body.saleTypeID);
    const paymentStatus = req.body.paymentStatus;
    const statusCode = parseInt(req.body.statusCode);

    let dateTime = new Date();
    let time = ("00" + dateTime.getHours()).slice(-2) + ":" + ("00" + dateTime.getMinutes()).slice(-2) + ":" + ("00" + dateTime.getSeconds()).slice(-2);
    let date = ("00" + dateTime.getFullYear()).slice(-4) + ":" + ("00" + (dateTime.getMonth()+1)).slice(-2) + ":" + ("00" + dateTime.getDate()).slice(-2);
    let saleDate = date + " " + time;
    console.log(saleDate);


    console.log(req.body);
    res.send('Thank you for ordering');
 })

module.exports = dineInOrdersRouter;