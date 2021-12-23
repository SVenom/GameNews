const mongoose=require('mongoose')
const loginnewSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        require:true,
        min:5
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("User",loginnewSchema)