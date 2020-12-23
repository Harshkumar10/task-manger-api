const jwt  = require('jsonwebtoken');
const mongoose  = require('mongoose');
const request = require('supertest');
const app = require('../src/app')

const User = require('../src/models/user');
const Task = require('../src/models/task');

// this will delete all the user from the database
const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id:userOneId,
    name:'shiv',
    email:'shiv@gmail.com',
    password:'test123',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const taskOne = {
    description:'codefores',
    completed:'true'
}

const taskTwo = {
    description:'codechef',
    completed:'false'
}
beforeAll(async () =>{
    await User.deleteMany();
    await Task.deleteMany();
})
// beforeEach(async()=>{
//     // console.log('before the test..');
//     // delete in the database so the we use the data 
//     // again and again
//     await User.deleteMany();

//     // then it will again save in the database
//     await new User(userOne).save();
// })

test(`Should sign up for a user`, async()=>{
    await request(app).post('/users')
    .send(userOne)
    .expect(201)
})

test(`Should login for a User`,async()=>{
    await request(app).post('/users/login')
    .send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
})

// now we are testing the endpoints with authentication
test(`Should get profile for the user`, async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // 200 is for the code of OK
    // 201 is for the created

    expect({
        name:response.body.name,
        email:response.body.email
    }).toEqual({
        name:'shiv',
        email:'shiv@gmail.com'
    })
})
// all here are the user test scripts
// test(`Should not signup user with invalid name/email/password`)



// i learned a lot form this tutorial

test(`Adding the task in the user`, async() => {
    await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send(taskOne).expect(201);
})

test(`Adding the 2nd task in the user`, async() => {
    await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send(taskTwo).expect(201);
})

//test to fetch the task of the user
test(`should fetch user task`, async () => {
    // we should collect the response from the request
    const response = await request(app)
        .get('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2);

})


// https://gist.github.com/Harshkumar10/0f432cc05a78b0f93edf72f4083c8507
