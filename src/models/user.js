const mongoose=require('mongoose');
//Library for validators
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task=require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        //emails to be unique
        unique:true,
        require:true,
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
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Can\'t contain password');
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type:Buffer
        //binary data
    }
},{
    timestamps:true
})

//relaiton between to entities

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//:user.getPublicProfile()
//******  toJSON */
userSchema.methods.toJSON = function(){
    const user=this
    const userOject=user.toObject();
    //we are getting all data

    //now we are hiding the data from the user to see when we are logging in
    //we do by deleting the unnecessary stuff
    delete userOject.password;
    delete userOject.tokens;
    return userOject;
}

userSchema.methods.generateAuthToken=async function(){
    const user=this;
    const token=jwt.sign({ _id:user._id.toString() },process.env.JWT_SECRET);

    user.tokens=user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('Unable to find user');
    }

    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch)
    throw new Error('Unable to login');
    return user;
}

//Match the plain text before saving
userSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8);
    }
    next();
})

//delete user tasks when user is removed
userSchema.pre('remove',async function(next){
    const user=this;
    await Task.deleteMany({owner:user._id});
    next();
})
// https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/

const User=mongoose.model('User',userSchema);

module.exports=User;