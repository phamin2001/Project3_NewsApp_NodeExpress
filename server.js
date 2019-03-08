const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const cors          = require('cors');
const session       = require('express-session');
const morgan        = require('morgan');

require('dotenv').config();
require('./db/db');

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'mySessions'
});

store.on('error', function(error) {
    console.log(error);
  });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(morgan('short'));

const authsController    = require('./controllers/authsController');
const topicsController   = require('./controllers/topicsController');
const usersController    = require('./controllers/usersController');

app.use('/api/v1/topics', topicsController);
app.use('/auths', authsController);
app.use('/users', usersController);

app.listen(process.env.PORT || 9000, () => {
    console.log('listening on port 9000');
})
