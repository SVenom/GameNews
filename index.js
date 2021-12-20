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
// const recipieData = require('./routes/recipie');
// // const msgRoute = require('./routes/msg');


const app = express();

// app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());







// app.set('views');
app.set('layouts', './layouts/main_layouts');
app.set('views engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")))


// // app.use(msgRoute);
// app.use(recipieData.route);
app.use("/",newsRoute);



// app.use((req, res, next) =>{
//     res.render('404.pug');
// })

// const server = http.createServer();
dbconnec();
app.listen(3000 ,()=>{console.log("server is running in 3000")});
