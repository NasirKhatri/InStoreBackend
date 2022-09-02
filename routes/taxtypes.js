const express = require('express');
const taxtypesRouter = express.Router();

taxtypesRouter.get('/', (req, res) => {
    res.send('TaxTypes Router is responding');
});

module.exports = taxtypesRouter;