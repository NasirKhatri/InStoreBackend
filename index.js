const express = require('express');
//const bodyParser = require('body-parser');     //Someone on Stackoverflow commented it has been deprecated

//Importing Routers
const customersRouter = require('./routes/customers');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const tablesRouter = require('./routes/tables');
const ridersRouter = require('./routes/riders');
const taxtypesRouter = require('./routes/taxtypes');
const branchesRouter = require('./routes/branches');
const subscribeRouter = require('./routes/subscription');
const loginRouter = require('./routes/login');

const app = express();
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

app.use('/subscribe', subscribeRouter);
app.use('/login', loginRouter);
app.use('/:clientID/customers', customersRouter);
app.use('/:clientID/categories', categoriesRouter);
app.use('/:clientID/items', itemsRouter);
app.use('/:clientID/users', usersRouter);
app.use('/:clientID/tables', tablesRouter);
app.use('/:clientID/riders', ridersRouter);
app.use('/:clientID/taxtypes', taxtypesRouter);
app.use('/:clientID/branches', branchesRouter);