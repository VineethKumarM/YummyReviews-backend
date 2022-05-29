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
let uniqueSuffix;
let cn = fs.readdirSync(path.join(__dirname, "/images"));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// cb(null, path.join(__dirname, "/images"));
		cb(null,'./frontend/public/images');
	},
	filename: function (req, file, cb) {
		let extn = file.originalname.split(".");
		uniqueSuffix = extn[extn.length - 1];
		cb(null, Date.now() + "." + uniqueSuffix);
	},
});
const upload = multer({ storage: storage });

router.get("/allposts", (req, res) => {
	const { authorization } = req.headers;
	Food.find()
		.populate("postedBy", "_id name")
		.then((foods) => {
			res.send({ foods });
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/profile", login, (req, res) => {
	// console.log("here");
	const user = req.user;
	Food.find({ postedBy: req.user._id })
		.populate("postedBy", "_id name")
		.then((foods) => {
			res.send({ foods, user });
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/usr/:name", (req, res) => {
	console.log("got profile req");
	const name = req.params.name;
	let uid, user;
	User.findOne({ name: name })
		.select("-password")
		.then((savedUser) => {
			// uid = savedUser._id;
			// user=sa
			console.log(savedUser.name, 2);
			Food.find({ postedBy: savedUser._id })
				.populate("postedBy", "_id name")
				.exec((err, foods) => {
					if (err) {
						console.log(err);
						return res.status(422).json({ error: err });
					}
					res.send({ foods, savedUser });
				});
		})
		.catch((err) => {
			console.log(err);
			return res.status(404).json({ error: "User not found" });
		});
});

router.post("/newpost", upload.single("photo"), login, (req, res) => {
	const { title, body } = req.body;
	const photo = req.file.filename;
	if (!title || !body || !photo) {
		return res
			.status(422)
			.json({ error: "Server said: All feilds are compulsory" });
	}
	req.user.password = undefined;
	const food = new Food({
		title,
		body,
		photo,
		postedBy: req.user,
	});

	food.save(food)
		.then((food) => {
			res.json({ food });
		})
		.catch((err) => {
			console.log("error while posting", err);
		});
});

router.put("/like", login, (req, res) => {

	Food.findByIdAndUpdate(
		req.body.foodId,
		{
			$push: { likes: req.user._id },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} 
		User.findByIdAndUpdate(
			req.user._id,
			{
				$push: { likes: req.body.foodId },
			},
			{ new: true }
		).exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err });
			} else {
				res.json(result);
			}
		});
	});
	

});

router.put("/unlike", login, (req, res) => {
	// console.log(req.user._id);

	Food.findByIdAndUpdate(
		// console.log(req.user);
		req.body.foodId,
		{
			$pull: { likes: req.user._id },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			// console.log("ue", err);
			return res.status(422).json({ error: err });
		} else {
			// console.log("ur", result);
			res.json(result);
		}
	});
});

router.delete("/delPost/:postid", login, (req, res) => {
	Food.findOne({ _id: req.params.postid })
		.populate("postedBy", "_id")
		.exec((err, food) => {
			if (err || !food) {
				return res.status(422).json({ error: err });
			}
			if (food.postedBy._id.toString() === req.user._id.toString()) {
				food.remove()
					.then((result) => {
						res.json({ message: "success" });
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
});

module.exports = router;
