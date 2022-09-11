const express = require('express');

function verifyParams(req, res, next) {
    //Only Admins are allowed to add category
    const authClientID = parseInt(req.authData.clientID);
    const clientID = parseInt(req.params.clientID)
    if (clientID != authClientID) res.status(403).json({ msg: "Sorry your are not authorized" });
    else {
        next();
    }
}

module.exports = verifyParams;