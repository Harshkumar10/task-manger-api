const express=require('express');
const router=new express.Router();
const User=require('../models/user');
const auth=require('../middleware/auth');
const { update } = require('../models/user');
const multer=require('multer');
const {sendWelcomeEmail}=require('../emails/account');

router.post('/users',async (req,res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        //sendWelcomeEmail(user.email,user.name);
        //const token= await user.generateAuthToken();
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
    
    // user.save().then(()=>{
    //     res.status(201).send(user);
    // }).catch((err)=>{
    //     res.status(400);
    //     res.send(e);
    // })
})

router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.generateAuthToken();
        //:user.getPublicProfile()
        res.send({user,token});
    }catch(e){
        res.status(400).send();
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token;
        })
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens=[];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

//logout from all sessions



router.get('/users/me',auth,async (req,res)=>{

    // try{
    //     const user=await User.find({});
    //     res.send(user);
    // }catch(e)
    // {
    //     res.status(500).send(e);
    // }

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((err)=>{
    //     res.status(500).send();
    // })
    res.send(req.user);
})


router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=['name','email','password','age'];

    const isValid=updates.every((updates)=>{
        return allowedUpdates.includes(updates);
    })

    if(!isValid)
    {
        return res.status(400).send({error:"Invalid field"});
    }

    try{
        updates.forEach((updates)=>{
            req.user[updates]=req.body[updates];
        })

        await req.user.save();
        //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators:true});
        res.send(req.user);

    }catch(e)
    {
        res.status(400).send(e);
    }
})

//users/:id is changed to /me
router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user=await User.findByIdAndDelete(req.user._id);

        await req.user.remove();
        //if user is deleted all its tasks should be deleted
        
        res.send(req.user);
    }catch(e)
    {
        res.status(500).send(e);
    }
})

module.exports= router;