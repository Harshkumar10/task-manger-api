const app = require('./app');
// const express=require('express');

// const app=express();
// require('./db/mongoose')
// const User=require('./models/user');
// const Task=require('./models/task');
// const userRouter=require('./routers/user');
// const taskRouter=require('./routers/task');
const multer=require('multer');


const port=process.env.PORT||3000;

// //to deploy the api
// const port=process.env.PORT;
// to registre a new middleware
// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('GET requests are disabled');
//     }else{
//         next();
//     }
// })

//mantainence mood
// app.use((req,res,next)=>{
//     res.status(503).send('site is currently down check back soon');
// })

const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please uplaod a word document'));
        }
        cb(undefined,true);
    }
})
// const errorMiddleware=(req,res,next)=>{
//     throw new Error('Error from middleware');
// }
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send();
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message});
// })

// app.use(express.json());

// //router creation
// app.use(userRouter);
// app.use(taskRouter);

app.listen(port,()=>{
    console.log(`server is on the port ${port}`);
})

// without middleware : new request => run route handler

// with middleware : new request => do something => run route handler

// const jwt= require('jsonwebtoken');
// const myFunction=async()=>{
//     const token=jwt.sign({_id:'abc123'},'thisismyfunction',{expiresIn:'7 days'});
//     console.log(token);

//     const data= jwt.verify(token,'thisismyfunction');
//     console.log(data);
// }
// myFunction();



