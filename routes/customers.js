const express = require('express');
const customersRouter = express.Router();

customersRouter.get('/', (req, res) => {
    res.send('Customers Router is responding')
});

module.exports = customersRouter;