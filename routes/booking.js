const express = require('express')
const router = express.Router();
const Booking = require('../model/Booking');

// Create Booking
router.post('/booking', async (req, res) => {
        const { service_type, people, therapist_gender, duration, who_is_this_massage_for, treatment, address, hotel, massage_table, stairs, date, time  } = req.body;
    try {
        const booking = new Booking({ service_type, people, therapist_gender, duration, who_is_this_massage_for, treatment, address, hotel, massage_table, stairs, date, time });
        const save_booking = await booking.save();
        //res.json(saveblog)
        return res.status(200).json({ message: "booking Saved" });
    } catch (error) {
        console.log(error);
    }
})

// Get Booking
router.get('/showBooking/:id', async (req, res) => {
    try {
        const booking = await Booking.find({id:req.params.id});
        res.json(booking)
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