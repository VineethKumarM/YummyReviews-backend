const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Food = mongoose.model("Food");
const login = require("../middleware/Login");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { JWT_Secret } = require("../keys");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");


router.put("/favpost", login, (req, res) => {

	User.findByIdAndUpdate(
		req.user._id,
		{
			$push: { favourites: req.body.foodId },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			const food = Food.findById(
				req.body.foodId
			)
		
			// console.log(food);
		
			res.json(result);
		}
	});

	

});


module.exports = router;
