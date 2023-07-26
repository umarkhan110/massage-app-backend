const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const provider = new mongoose.Schema({
    fullname:{
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
    image:{
        type:String,
    },
    gender:{
        type:String,
        required:true
    },
    nearest:{
        type:String,
        required:true
    },
    expertise :{
        type:String,
        required:true
    },
    liability  :{
        type:String,
        required:true
    },
    certified :{
        type:String,
        required:true
    },
    highest_level_of_training  :{
        type:String,
        required:true
    },
    years_of_experience  :{
        type:String,
        required:true
    },
    upcoming_orders:[
        {
            order:{
                type:String,
            }
        }
    ],
    status:{
        type:String,
    }, 
    password: {
        type:String,
    },

});


if(this.password !== ""){
provider.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        // this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});
}

provider.methods.generateAuthToken = async function (){
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
const Providers = new mongoose.model('Providers',provider);
module.exports = Providers;

