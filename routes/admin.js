const express = require("express");
const router = express.Router();
const Admins = require("../model/Dashboard")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const Providers = require('../model/Provider');
const authenticate = require('../middleware/admin');

router.post("/signup",  async (req, res) => {
  const { email, password } = req.body;
  try {
    const role = "Admin"
      const user = new Admins({ email, password, role });
      await user.save();
      return res.status(200).json({ message: "Admin Created Successfully" });

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
      const emailExist = await Admins.findOne({ email: email });
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

// Get All Providers
router.get('/showProviders', authenticate, async (req, res) => {
  try {
      const providers = await Providers.find();
      res.json(providers)
  } catch (error) {
          console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
})

// Get Providers By id
router.get('/showProvider/:id', authenticate, async (req, res) => {
  try {
      const provider = await Providers.findById(req.params.id);
      res.json(provider)
  } catch (error) {
      console.log(error);
  }
})

// Approve Provider
router.put('/approveProvider/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const provider = await Providers.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status
        },
      },
      { new: true }
    );
      res.json(provider)
  } catch (error) {
          console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
})

// Generate New Password for provider

router.put('/updateProviderPassword/:id', authenticate, async (req, res) => {
  try {
    const {  password } = req.body;
    if (password) {
    const passwordhash = await bcrypt.hash(password, 12);

    const provider = await Providers.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password:passwordhash,
        },
      },
      { new: true }
    );

    res.json(provider);}
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
