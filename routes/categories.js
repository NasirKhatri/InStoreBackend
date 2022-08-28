const express = require('express');
const categoriesRouter = express.Router();

categoriesRouter.get('/', (req, res) => {
    res.send('Categories Router is responding')
});

module.exports = categoriesRouter;