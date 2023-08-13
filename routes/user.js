const express = require("express");
const router = express.Router();
const Users = require("../model/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const stripe = require("stripe")(process.env.STRIPE_KEY)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, './uploads')
//   },
//   filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

router.post("/signup",  async (req, res) => {
  const { name, email, phone, password } = req.body;
//   const image = (req.file) ? req.file.filename : null;
  try {
    const role = "Client"
    const userExist = await Users.findOne({ email: email });
    if (userExist) {
      return res.status(422).send({ message: "Email is already exist." });
    } 
    else {
      const user = new Users({ name, email, phone, password, role });
      await user.save();
      return res.status(200).json({ message: "User Created Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    let token;
      if (!email || !password) {
          return res.status(400).json({ error: "plz fill the filled" })
      }
      const emailExist = await Users.findOne({ email: email });
      if (emailExist) {
          const passMatch = await bcrypt.compare(password, emailExist.password);
          if (!passMatch) {
              res.status(400).json({ error: "Password is not correct" })
          }else {
            token = await emailExist.generateAuthToken();
              res.json({ message: "Login Successfully", data: {token, emailExist} });
          }
      } else {
          res.status(400).json({ error: "Wrong Email" });
      }
  } catch (error) {
      console.log(error)
  }
})

router.put('/updateuser/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let image = req.body.image; // Default to the existing image

    // Check if a new image is uploaded
    // if (req.file) {
    //   image = req.file.filename;
    // }
    if (password) {
    const passwordhash = await bcrypt.hash(password, 12);

    const user = await Users.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          fname,
          lname,
          email,
          phone, 
          gender, 
          age,
          password:passwordhash,
        },
      },
      { new: true }
    );

    res.json(user);}
  } catch (error) {
    console.log(error);
  }
});



router.post("/payment", async (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency:"usd",
    },
    (stripeErr, stripeRes) =>{
      if(stripeErr){
        res.status(500).json(stripeErr)
      }else{
        res.status(200).json(stripeRes)
      }
    }
  )
});

module.exports = router;
