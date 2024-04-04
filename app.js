require('dotenv').config();

const express = require('express');
//Express.js Middleware used for including EJS(Embedded JS)
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');


const connectDB = require('./server/config/db.js');
const session = require('express-session');
const {isActiveRoute} = require('./server/helpers/routeHelper.js')

const app = express();
const PORT = 5000 || process.env.PORT;

//Connect to DB
connectDB();

//Below code help us to transfer data through forms
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

//Our website css,js and other necessary things inside public folder
app.use(express.static('public'));

//Templating engine for EJS
app.use(expressLayout);
app.set('layout','./layouts/main');
//Set EJS as the view engine
app.set('view engine','ejs');

app.locals.isActiveRoute = isActiveRoute; 


app.use('/',require('./server/routes/main.js'));
app.use('/',require('./server/routes/admin.js'));


app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`);
})