const express = require('express');
const itemsRouter = express.Router();

itemsRouter.get('/', (req, res) => {
    res.send('Items Router is responding');
});

module.exports = itemsRouter;