const mongoose = require('mongoose');
function dbconnc(){
    mongoose.connect("mongodb+srv://Sus2:Susovan2000@cluster0.wxmtt.mongodb.net/GamingNews?retryWrites=true&w=majority");
      

        const db = mongoose.connection;
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open',function(){
            console.log('Connected')
        });

}
module.exports=dbconnc;


// Models
require('../model/category');
require('../model/exp_news')