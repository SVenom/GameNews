const mongoose = require('mongoose');

 const ExpolreNewsSchema = new mongoose.Schema({
     name:{
         type:String,
         required:true
     },
        
     description:{ 
         type:String,
        required:true
    },
    news:{ 
        type:String,
       required:true
     },
    category:{ 
        type:String,
        required:true
    },
    image:{ 
        type:String,
       required:true
   },
 });

 module.exports = mongoose.model('latestnews', ExpolreNewsSchema);