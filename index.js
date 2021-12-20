// this is the main page .
const http = require('http');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const dbconnec =require('./utils/database');
const express = require('express');


const bodyParser = require('body-parser');
const newsRoute = require('./routes/news');

const app = express();

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());


app.set('layouts', './layouts/main_layouts');
app.set('views engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")))


app.use("/",newsRoute);

dbconnec();
app.listen(3000 ,()=>{console.log("server is running in 3000")});
