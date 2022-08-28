const express = require('express');
const usersRouter = express.Router();

usersRouter.get('/', (req, res) => {
    res.send('Users Router is responding');
});

module.exports = usersRouter;