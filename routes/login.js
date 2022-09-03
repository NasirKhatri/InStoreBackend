const express = require('express');
const loginRouter = express.Router();
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

//Importing Database Connection
const db = require('../dbConnection');
const query = util.promisify(db.query).bind(db);

//Create JSON web Token
const createTokens = (user) => {
    const accessToken = jwt.sign(
      { username: user[0].Name, clientID: user[0].ClientID, userID: user[0].UserID, roleID: user[0].RoleID },
      config.jwtSecret,
      {expiresIn: '5h'}
    );
    return accessToken;
  };


loginRouter.post('/', (req, res) => {
    //destructuring request
    const Email = req.body.Email;
    const Password = req.body.Password;

    const SQL = `SELECT * FROM users WHERE Email = '${Email}'`;

    (async() => {
        try {

            //Checking if the user exist in Database
            const user = await query(SQL);
            if(user.length === 0) { res.status(400).json({msg: "User Does Not Exist"}); return}

            // Comparing user input password and db password
            bcrypt.compare(Password, user[0].Password).then((match) => {
                if(!match) {res.status(400).json({msg: "Invalid Password"}); return}
                else {
                    const accessToken = createTokens(user);
                    res.status(200).json({Token: accessToken, UserID: user[0].UserID, ClientID: user[0].ClientID, Name: user[0].Name, RoleID: user[0].RoleID, LocalUserID: user[0].LocalUserID });
                    return;
                }
            })
        }
        catch(err) {
            res.status(500).json({msg: "Something went wrong"});
            return;
        }
    })()

})

module.exports = loginRouter;