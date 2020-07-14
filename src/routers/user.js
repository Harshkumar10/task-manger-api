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
        const token= await user.generateAuthToken();
        res.status(201).send({user,token});
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

//not required as we have the user /users/me

// router.get('/users/:id',async(req,res)=>{
//     const _id=req.params.id;

//     try{
//         const user = await User.findById(_id);
//         if(!user)
//         {
//             return res.status(404).send();
//         }
//         res.send(user);
//     }catch(e){
//         res.status(500).send();
//     }

//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send();
//     //     }
//     //     res.send(user);
//     // }).catch((err)=>{
//     //     res.status(500).send();
//     // })
// })

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


// router.patch('/users/:id',async (req,res)=>{

//     const updates=Object.keys(req.body);
//     const allowedUpdates=['name','email','password','age'];

//     const isValid=updates.every((updates)=>{
//         return allowedUpdates.includes(updates);
//     })

//     if(!isValid)
//     {
//         return res.status(400).send({error:"Invalid field"});
//     }

//    // console.log(updates);
//     try{
//         const  user = await User.findById(req.params.id);
//         updates.forEach((updates)=>{
//             user[updates]=req.body[updates];
//         })

//         await user.save();
//         //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators:true});

//         if(!user)
//         {
//             return res.status(404).send();
//         }
//         res.send(user);
//     }catch(e)
//     {
//         res.status(400).send(e);
//     }
// })

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

const upload=multer({
    //dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('upload a image'));
        }
        callback(undefined,true);

    }
})

//restrict file type and file size
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.user.avatar=req.file.buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})
//image encoding
//<img src="data:image/jpg;base64,--key-->

//fetching the profile picture
//by url localhost:3000/5ef393eb237f9b35d4fdcd63/avatar
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user)
        {
            //no image or no user
            throw new Error();
        }
        //respose header
        res.set('Content-Type','image/jpg');
        res.send(user.avatar)
    }catch(e){
        res.status(404).send();
    }
})
module.exports= router;