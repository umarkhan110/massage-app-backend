const express = require('express')
const router = express.Router();
const Expenses = require('../model/Expenses');
const Users = require('../model/User');

// Create New Blog
router.post('/createExpense', async (req, res) => {
    const { title, amount, date, userID } = req.body;
    try {
        const expense = new Expenses({ userID, title, amount, date });
        const saveExpense = await expense.save();
        //res.json(saveblog)
        return res.status(200).json({ message: "Expense Saved" });
    } catch (error) {
        console.log(error);
    }
})

// Get Expenses
router.get('/showExpenses/:id', async (req, res) => {
    try {
        const expense = await Expenses.find({userID:req.params.id});
        res.json(expense)
    } catch (error) {
        console.log(error);
    }
})

router.delete("/deleteExpense/:id", async (req, res) => {
	try {
		const expenseId = req.params.id;
		await Expenses.findByIdAndDelete(expenseId);

		return res
			.status(200)
			.json({ message: "Expense deleted successfully" });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: "Failed to delete the expense" });
	}
});


module.exports = router;