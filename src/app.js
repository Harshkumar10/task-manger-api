const express = require("express");

const app = express();
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
// const multer=require('multer');

//const port=process.env.PORT||3000;

//to deploy the api
const port = process.env.PORT;

app.use(express.json());

//router creation
app.use(userRouter);
app.use(taskRouter);

// console.log(decode);
module.exports = app;
