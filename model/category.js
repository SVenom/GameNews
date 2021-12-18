const mongoose = require('mongoose');

 const CtaegorySchema = new mongoose.Schema({
     name:{
         type:String,
         required: 'This file is required.'
     },
        
     image:{ 
         type:String,
        required: 'This file is required.'
    },
 });

 module.exports = mongoose.model('Category', CtaegorySchema);