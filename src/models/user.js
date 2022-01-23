
const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true 
    },
  
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('Age must be a postive number')
            }
        }
    },
      email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        } 

    },
    password:{
      type:String,
      required:true,
      trim:true,
      minlength:8 
    },
    phoneNumber:{
        type:String,
        trim:true,
   
        validate(value){
          if (!validator.isMobilePhone(value,'ar-EG') && value.length > 10 && value.length <= 11) {
              throw new Error('Phone is invalid');
             }
        }
  },
    tokens:[
        {
            type:String,
            required:true
        }
    ]
},
{ timestamps: { 
    currentTime: () => Math.floor(Date.now())
  }}
);
schema.virtual('tasks',{
    ref:'dec_user', 
    localField:'_id', 
    foreignField:'owner'
  })
schema.pre('save',async function(next){
    const user =this
    if(user.isModified('password')){
        user.password=await bycrypt.hash( user.password,8)
    }
   next()
})
schema.statics.findByCredentials= async (email,password)=>{
    const user=await User.findOne({email})
     if(!user){
        throw new Error ("unable to login email ")
    
    }
    const isMatch =await bycrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error ("unable to login passowrd")
    }
    return user
}
schema.methods.generateToken= async function(){
    const user =this
    const token = jwt.sign({_id:user._id.toString()},"nodecourse")
    user.tokens =user.tokens.concat(token)
    await user.save()
    return token
}
const User = mongoose.model('User',schema)
module.exports = User