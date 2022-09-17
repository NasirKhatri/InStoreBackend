const express = require('express');

function authorization(roles) {

    return (req, res, next) => {
        const roleID = parseInt(req.authData.roleID);
        if (!roles.includes(roleID)) res.status(403).json({ msg: "Sorry your are not authorized" });
        else {
            next();
        }
    }

}

module.exports = authorization;