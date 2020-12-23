const express=require('express');
const router=new express.Router();
const auth=require('../middleware/auth');
const Task=require('../models/task');

//create new task
router.post('/tasks',auth,async(req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e)
    {
        res.status(400).send(e);
    }
})

//GET/tasks?completed=false
//***           pagination
//GET/tasks?limit=10&skip=20
//limit skip
//GET/tasks?sortBy=createdAt:asc or _desc
router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed)
    {
        match.completed=req.query.completed==='true' //it return string converted to boolean by equating
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':');
        sort[parts[0]] = parts[1]==='desc'?-1:1;
    }
    try{
        // const task = await Task.find({owner:req.user._id});
        //or
        await req.user.populate({
            path:'tasks',
            // match:{
            //     completed:false
            // }
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // console.log(req.user.tasks);
        res.send(req.user.tasks);
        // console.log(req.user);
    }catch(e){
        res.status(500).send();
}
// Task.find({}).then((tasks)=>{
//     res.send(tasks);
// }).catch((err)=>{
//     res.status(500).send();
// })
})

router.get('/tasks/:id',auth,async(req,res)=>{
const _id=req.params.id;

try{
    //const task=await Task.findById(_id);
    const task=await Task.findOne({_id,owner:req.user._id})
    if(!task)
    {
        return res.status(404).send();
    }
    res.status(200).send(task);
}catch(e){
    res.status(400).send();
}

})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=['description','completed'];
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates"});
    }

    try {
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id});
        if(!task)
        {
            return res.status(404).send();
        }

        updates.forEach((update)=>task[update]=req.body[update]);
        await task.save();
        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }

})

router.delete('/tasks/:id',auth,async(req,res)=>{
try {
    const task=await Task.findByIdAndDelete({_id:req.params.id,owner:req.body._id});
    if(!task)
    {
        return res.status(404).send();
    }
    res.status(500).send(task);
} catch (error) {
    res.status(404).send();
}
})

module.exports = router;