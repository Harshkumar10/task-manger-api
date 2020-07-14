//crud create read update delete
// const mongodb=require('mongodb');
// const MongoClient=mongodb.MongoClient;
// const ObjectID=mongodb.ObjectID;

const {MongoClient,ObjectID}=require('mongodb');

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'


MongoClient.connect(connectionURL,{useNewUrlParser:true,useUnifiedTopology:true},(error,client)=>{
    if(error)
    return console.log('Unable to connect');

    const db=client.db(databaseName)
    // // db.collection('users').findOne({_id: new ObjectID("5eb01d50ce469f3f909dde2e")},(err,result)=>{
    // //     if(err)
    // //     return console.log('unablur fetch dex');
    // //     console.log(result);
    // // })
    // db.collection('users').find({age:27}).toArray((err,result)=>{
    //     console.log(result);
    // })
//    db.collection('users').updateOne({
//         _id: new ObjectID("5eb014505d99d11ce080b501")

//     },{
//         $inc:{
//             age:1
//         }
//     }).then((result)=>{
//         console.log(result);
//     }).catch((err)=>{
//         console.log(err);
//     })
        // db.collection('tasks').updateMany({},{
        //     $set:{
        //         completed:false
        //     }
        // }).then((result)=>{
        //     console.log(result);
        // }).catch((err)=>{
        //     console.log(err)
        // })
        // db.collection('users').deleteMany({
        //     age:27
        // }).then((result)=>{
        //     console.log(result);
        // }).catch((err)=>{
        //     console.log(err);
        // })
        db.collection('tasks').deleteOne({description:'codechef'}).then((result)=>{
            console.log(result.deletedCount);
        }).catch((err)=>{
            console.log(err);
        })
})