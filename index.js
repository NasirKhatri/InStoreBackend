const express = require('express');
const bodyParser = require('body-parser');
const customersRouter = require('./routes/customers');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const tablesRouter = require('./routes/tables');
const ridersRouter = require('./routes/riders');
const taxtypesRouter = require('./routes/taxtypes');
const branchesRouter = require('./routes/branches');


const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

app.use('/client/:clientID/user/:userID/customers', customersRouter);
app.use('/client/:clientID/user/:userID/categories', categoriesRouter);
app.use('/client/:clientID/user/:userID/items', itemsRouter);
app.use('/client/:clientID/user/:userID/users', usersRouter);
app.use('/client/:clientID/user/:userID/tables', tablesRouter);
app.use('/client/:clientID/user/:userID/riders', ridersRouter);
app.use('/client/:clientID/user/:userID/taxtypes', taxtypesRouter);
app.use('/client/:clientID/user/:userID/branches', branchesRouter);