const mongoose = require('mongoose')
const userSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true  
    },
    description:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},
{ timestamps:true
  }
);
const dec_user = mongoose.model('dec_user',userSchema)
module.exports = dec_user