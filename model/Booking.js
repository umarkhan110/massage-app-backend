const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const booking = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    service_type:{
        type:String,
        required:true
    },
    people:{
        type:String,
        required:true
    },
    therapist_gender:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    who_is_this_massage_for:{
        type:String,
        required:true
    },
    treatment:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    // hotel :{
    //     type:Boolean,
    //     required:true
        // },
        // massage_table :{
    //     type:String,
    //     required:true
    // },
    // stairs:{
    //     type:String,
    //     required:true
    // },
    date :{
        type:String,
        required:true
    },
    // time  :{
    //     type:String,
    //     required:true
    // },
    status :{
        type:String,
        required:true
    }
});


const Bookings = new mongoose.model('Bookings',booking);
module.exports = Bookings;