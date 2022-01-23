const express = require('express')
const jwt =require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')
const auth=require('../middleware/auth')

router.post('/signup', async(req, res) => {
     
    
    try{
        const user = new User(req.body)
          await user.save()
          const token =await user.generateToken()
          console.log(user.createdAt)  
          const time=user.createdAt
            res.status(200).send({user,token,time}) 
           
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/profile',auth,(req,res)=>{
    res.send(req.user)
})

////////////////////////////////////////////////////////

router.patch('/profile',auth,async(req,res)=>{

    const updates = Object.keys(req.body)
    try{
        const user = req.user
        updates.forEach((update)=> (user[update] = req.body[update]))
       await user.save()
    //    const time=user.updatedAt;
        res.status(200).send({user})
    }
    catch(e){
        res.status(400).send(e.message) 
    }
})
router.patch('/users/:id',auth,async (req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send("unable")
        }
        updates.forEach((update)=> (user[update] = req.body[update]))
       await user.save()
       const time=user.updatedAt;
        res.status(200).send({user,time})
    }
    catch(e){
        res.status(400).send(e.message)

    }
})

router.delete('/users/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send('No user is found')
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
router.delete('/profile',auth,async(req,res)=>{
   
    try{
        const user = await User.deleteOne(req.user)
        console.log(user)
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.post('/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token =await user.generateToken()
        res.status(200).send({user,token})
        // res.status(200).send({user})       
        
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.user.save()
        res.send('log out')
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


module.exports = router
