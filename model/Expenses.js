const mongoose = require('mongoose');

const expense = new mongoose.Schema({
    userID:{
       type:String,
       required:true
    },
    title:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});


const Expenses = new mongoose.model('Expenses', expense);
module.exports = Expenses;