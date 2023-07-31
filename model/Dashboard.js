const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const admin = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
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

admin.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        // this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

admin.methods.generateAuthToken = async function () {
    try {
      const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, {
        expiresIn: '1h', // Token expiration time
      });
      this.tokens = this.tokens.concat({ token: token });
  
      // Save the updated tokens array to the database
      await this.save();
  
      return token;
    } catch (err) {
      console.log(err);
    }
  };

const Admins = new mongoose.model('Admins',admin);
module.exports = Admins;