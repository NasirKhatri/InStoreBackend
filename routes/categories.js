const express = require('express');
const categoriesRouter = express.Router();
const verifyToken = require("../functions/userVarification");

categoriesRouter.post('/', verifyToken, (req, res) => {
    res.json({Token: req.token, authData: req.authData})
});

module.exports = categoriesRouter;