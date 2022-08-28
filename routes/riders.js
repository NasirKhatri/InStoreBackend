const express = require('express');
const ridersRouter = express.Router();

ridersRouter.get('/', (req, res) => {
    res.send('Riders Router is responding')
});

module.exports = ridersRouter;