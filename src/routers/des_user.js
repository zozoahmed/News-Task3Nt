const express = require('express')
const dec_user = require('../models/des_user')
const auth=require('../middleware/auth')
const router = express.Router()

router.post('/task', auth,async(req, res) => {
    const user = new dec_user({...req.body,owner:req.user._id})
    try{
         await user.save()
        res.send(user)
    }
    catch(e){
        res.status(400).send(e.message)

    }
    
})
router.get('/tasks', auth,async(req, res) => {
    try{
        const user= await dec_user.find({})
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/task/:id',auth,async (req,res)=>{
  const _id = req.params.id
  try{
    const user=await dec_user.findOne({_id,owner:req.user._id})
    if(!user){
        return  res.status(404).send('Unable to find task')
      }
      res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.patch('/task/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
        const user=await dec_user.findOneAndUpdate({_id,owner:req.user._id},req.body,{
           new:true,
           runValidators:true 
        })
        if(!user){
            return res.status(404).send("unable to update")
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e.message)

    }
})
router.delete('/task/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const user=await dec_user.findOneAndDelete({_id,owner:req.user._id})
       if(!user){
           return res.status(404).send('no user found')
       }
       res.send(user)
    }
    catch(e){
      res.status(500).send(e.message)
    }
})

module.exports = router