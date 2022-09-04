const express = require('express');

function authorization(req, res, next) {
    //Only Admins are allowed to add category
    const roleID = parseInt(req.authData.roleID);
    if (roleID !== 1) res.status(403).json({ msg: "Sorry your are not authorized to add branches" });
    else {
        next();
    }
}

module.exports = authorization;