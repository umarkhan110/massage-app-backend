const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    // image:{
    //     type:String,
    // },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});

user.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        // this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

user.methods.generateAuthToken = async function (){
    try{
        let token =jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY, {
            expiresIn: 1000,
          });
        this.tokens = this.tokens.concat({token:token});
        return token;
    }catch  (err){
        console.log(err);
    }
}

const Users = new mongoose.model('Users',user);
module.exports = Users;