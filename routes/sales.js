const express = require('express');
const salesRouter = express.Router();
const util = require('util');
const verifyToken = require("../functions/userVarification");
const authorization = require('../functions/authorization');
const verifyParams = require('../functions/verifyParams');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

salesRouter.post('/:clientID', verifyToken, authorization([1, 2, 4, 8]), verifyParams, (req, res) => {
    //users with role Admin, All and Cashier are allowed to access this route

    //Destructuring the Request Body
    const clientID = parseInt(req.body.clientID);
    const userID = parseInt(req.body.userID);
    const roleID = parseInt(req.body.roleID);

    const itemDetails = req.body.itemDetails;
    const saleDate = req.body.saleDate;
    const paymentMode = req.body.paymentMode;
    const receivedAmount = req.body.receivedAmount;
    const returnedAmount = req.body.returnedAmount;
    const balance = req.body.balance;
    const customerID = req.body.customerID;
    const noOfProducts = req.body.products;
    const noOfItems = req.body.itemsQty;
    const grossPrice = req.body.subTotal;
    const lineItemDiscount = req.body.itemDisc;
    const additionalDiscount = req.body.additionalDiscount;
    const taxAmount = req.body.taxAmount;
    const billAmount = req.body.total;
    const saleTypeID = parseInt(req.body.saleTypeID);
    const paymentStatus = req.body.paymentStatus;
    const statusCode = parseInt(req.body.statusCode);

    (async () => {
        try {
            //Create Local saleID
            const SQL1 = `SELECT COUNT(ClientID) AS 'salesCount' FROM sales WHERE ClientID = ${clientID};`;
            let counter = await query(SQL1);
            counter = counter[0].salesCount + 1;
            const localSalesID = ('000000' + counter).slice(-7);

            //Adding sale in the database
            const SQL2 = `INSERT INTO sales 
                (SaleID, LocalSaleID, ClientID, UserID, CustomerID, SaleDateTime, NoOfProducts, NoOfItems, 
                    GrossPrice, LineItemDiscount, AdditionalDiscount, TaxAmount, PaymentMode, BillAmount, ReceivedAmount, 
                        ReturnedAmount, Balance, DeliveryDateTime, ServingDateTime, SaleTypeID, PaymentStatus, StatusCode) 
                VALUES (NULL, '${localSalesID}', ${clientID}, ${userID}, ${customerID}, '${saleDate}', ${noOfProducts}, ${noOfItems}, 
                    ${grossPrice}, ${lineItemDiscount}, ${additionalDiscount}, ${taxAmount}, '${paymentMode}', ${billAmount}, ${receivedAmount}, 
                        ${returnedAmount}, ${balance}, NULL, NULL, ${saleTypeID}, '${paymentStatus}', ${statusCode})`;
            const addedSale = await query(SQL2);
            const saleID = addedSale.insertId;

            //Adding Sale Lines in the database
            const values = itemDetails.map(item => {
                let TaxAmount = 0;
                let ItemDisc = 0;
                let Total = 0;

                if (!item.TaxBfrDisc) {
                    ItemDisc = (item.SalesPrice * (item.Discount / 100)) * item.Qty;
                    TaxAmount = parseFloat((((item.SalesPrice - item.SalesPrice * (item.Discount / 100)) * (taxDetails.TaxRate / 100)) * item.Qty).toFixed(2));
                }
                else {
                    ItemDisc = (item.SalesPrice * (item.Discount / 100)) * item.Qty;
                    TaxAmount = parseFloat(((item.SalesPrice * (item.TaxRate / 100)) * item.Qty).toFixed(2));
                }

                Total = (item.Qty * item.SalesPrice - ItemDisc + TaxAmount).toFixed(2);

                return `(NULL, ${clientID}, ${saleID}, ${item.ItemID}, ${item.Qty}, ${item.SalesPrice}, ${item.Discount}, ${item.TaxTypeID}, ${item.TaxBfrDisc}, ${TaxAmount}, ${Total}, 'Open')`
            })

            const SQL3 = `INSERT INTO salelines VALUES ${values}`;
            const addedLines = await query(SQL3);

            res.status(200).json({ msg: "Sale have been added" });

        }
        catch (err) {
            res.status(500).json({ msg: "Something went wrong" });
        }

    })()
})

module.exports = salesRouter;