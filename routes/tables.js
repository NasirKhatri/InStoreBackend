const express = require('express');
const tablesRouter = express.Router();

tablesRouter.get('/', (req, res) => {
    res.send('Tables Router is responding');
});

module.exports = tablesRouter;