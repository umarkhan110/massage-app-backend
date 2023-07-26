const express = require('express')
const router = express.Router();
const Providers = require('../model/Provider');
const Orders = require('../model/Booking');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create New Provider
router.post('/apply_provider', upload.single("image"), async (req, res) => {
    const status = "Pending"
        const { fullname, email, phone, gender, nearest, certified, expertise, liability, highest_level_of_training, years_of_experience, password  } = req.body;
        const image = (req.file) ? req.file.filename : null;
        try {
        const provider = new Providers({ fullname, email, phone, gender, nearest, certified, expertise, liability, highest_level_of_training, years_of_experience, password, status, image });
        const saveProvider = await provider.save();
        //res.json(saveblog)
        return res.status(200).json({ message: "Provider Saved" });
    } catch (error) {
        console.log(error);
    }
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
      let token;
        if (!email || !password) {
            return res.status(400).json({ error: "plz fill the filled" })
        }
        const emailExist = await Providers.findOne({ email: email });
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




// Get Providers By id
router.get('/showProvider/:id', async (req, res) => {
    try {
        const provider = await Providers.find({id:req.params.id});
        res.json(provider)
    } catch (error) {
        console.log(error);
    }
})
 // Orders Available in his Area
router.get('/availbleOrders', async (req, res) => {
    try {
        const provider = await Providers.find({id:req.params.id});
        const order = await Orders.find({address:provider.nearest})
        res.json(provider)
    } catch (error) {
        console.log(error);
    }
})
// Upcoming Orders
router.get('/upcomingOrders', async (req, res) => {
    try {
        const providers = await Providers.find();
        res.json(providers)
    } catch (error) {
        console.log(error);
    }
})
// router.delete("/deleteExpense/:id", async (req, res) => {
// 	try {
// 		const expenseId = req.params.id;
// 		await Expenses.findByIdAndDelete(expenseId);

// 		return res
// 			.status(200)
// 			.json({ message: "Expense deleted successfully" });
// 	} catch (error) {
// 		console.log(error);
// 		return res
// 			.status(500)
// 			.json({ message: "Failed to delete the expense" });
// 	}
// });


module.exports = router;