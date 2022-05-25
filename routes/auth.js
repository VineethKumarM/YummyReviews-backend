const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const { useReducer } = require("react/cjs/react.production.min");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_Secret } = require("../keys");
const login = require("../middleware/Login");

// "email": "vini@gmail.com",
// "password": "12erw3"
//ram ram@gmail ram

router.get("/protected", login, (req, res) => {
	res.send("hi protected");
});

router.post("/signup", (req, res) => {
	const { name, email, password } = req.body;
	if (!email || !password || !name) {
		return res.json({ error: "please fill all fields" });
	}

	User.findOne({ email: email })
		.then((savedUser) => {
			if (savedUser) {
				console.log("User already exists");
				return res.json({
					error: "email or username already registered, try a different one",
				});
			}
			User.findOne({ email: email }).then((svuser) => {
				if (svuser) {
					console.log("User already exists");
					return res.json({
						error: "email or username already registered, try a different one",
					});
				}
			});
			bcrypt.hash(password, 12).then((hashedpassword) => {
				const user = new User({
					name,
					email,
					password: hashedpassword,
				});

				user.save()
					.then((user) => {
						res.json({ message: "registration successful" });
					})
					.catch((err) => {
						console.log("error while saving", err);
					});
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(422).json({ error: "please fill the credentials" });
	User.findOne({ email: email }).then((savedUser) => {
		if (!savedUser) {
			return res.status(422).json({ error: "Invalid email or password" });
		}

		bcrypt
			.compare(password, savedUser.password)
			.then((doMatch) => {
				if (doMatch) {
					// res.json({ message: "signed in" });
					const token = jwt.sign({ _id: savedUser._id }, JWT_Secret);
					const { _id, name, email } = savedUser;
					res.json({ token, user: { _id, name, email } });
				} else
					return res
						.status(422)
						.json({ error: "Invalid credentials" });
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

module.exports = router;
