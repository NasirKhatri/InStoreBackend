const express = require('express');
const branchesRouter = express.Router();

branchesRouter.get('/', (req, res) => {
    res.send('Branches Router is responding');
});

module.exports = branchesRouter;