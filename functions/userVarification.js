const express = require('express');
const config = require("../config.json");
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        jwt.verify(req.token, config.jwtSecret, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.authData = authData;
                next();
            }
        });
    }
    else {
        res.sendStatus(403);
    }
}

module.exports = verifyToken;