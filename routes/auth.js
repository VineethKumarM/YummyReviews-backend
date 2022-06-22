const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const login = require("../middleware/Login");
const multer = require("multer")



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// cb(null, path.join(__dirname, "/images"))
		cb(null,'./frontend/public/images');
	},
	filename: function (req, file, cb) {
		let extn = file.originalname.split(".");
		uniqueSuffix = extn[extn.length - 1];
		cb(null, Date.now() + "." + uniqueSuffix);
	},
});
const upload = multer({ storage: storage });


router.post("/signup", (req, res) => {
	const { name, email, password ,image} = req.body;
	if (!email || !password || !name) {
		return res.json({ error: "please fill all fields" });
	}
	console.log(1);

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
			// if()
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
					const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
					// console.log(token,savedUser);
					const { _id, name, photo, favourites, likes, social } = savedUser;
					res.json({ token, user: { _id, name, photo, favourites, likes, social } });
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
