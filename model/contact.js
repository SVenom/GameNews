const mongoose = require('mongoose');

 const contactUs = new mongoose.Schema({
     email:{
         type:String,
         required:true
     },
        
     user:{ 
         type:String,
        required:true
    },
    topic:{ 
        type:String,
       required:true
     },
    details:{ 
        type:String,
        required:true
    }
 });


 module.exports = mongoose.model('customerservice', contactUs);