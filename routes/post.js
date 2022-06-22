const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const geoCoder = require('@mapbox/mapbox-sdk/services/geocoding')

const User = mongoose.model("User");
const Food = mongoose.model("Food");

const mbxToken = process.env.MAPBOX_TOKEN;
const login = require("../middleware/Login");
const app = express();
const gcoder= geoCoder({ accessToken: 'pk.eyJ1IjoidmluZWV0aGt1bWFybSIsImEiOiJjbDRtOXBqMWkxMzk3M2RtaHk5enNldDdlIn0.48Z2Y_aage38ZnfMdch8eA'});

let uniqueSuffix;

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
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
	Food.find()
		.populate("postedBy", "_id name")
		.then((foods) => {
			// console.log(foods);
			res.send({ "Food":foods });
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/profile", login, (req, res) => {
	const user = req.user;
	Food.find({ postedBy: req.user._id })
		.populate("postedBy", "_id name")
		.then((foods) => {
			User.findById(user._id)
			.populate("likes favourites","_id title")
			// .populate("favourites", "_id title")
			.then((userData) => {
				res.send({ foods, userData });

			})
		})
		.catch((err) => {
			console.log(err);
		});
});


router.get("/post/:id",login,(req,res)=> {
	Food.findById(req.params.id)
	.populate("postedBy", "_id name")
	.then((food) =>{
		let foods=[];
		foods.push(food)
		// console.log(foods);
		res.send({foods});
	})
	.catch((err) => {
		console.log(err);
		return res.status(404).json({ error: "Post not found" });
	});
})

router.get("/usr/:name", (req, res) => {
	const name = req.params.name;
	let uid, user;
	User.findOne({ name: name })
		.select("-password")
		.populate("likes favourites","_id title")
		.then((savedUser) => {
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

router.post("/newpost", login, (req, res) => {
	const { title, body, hotel,url } = req.body;
	// const photo = req.file.filename;
	let cord;
	gcoder.forwardGeocode({
		query : req.body.location,
		limit: 1
	}).send()
	.then((data) => {
		cord = data.body.features[0].geometry;
		// console.log(url);
		if (!title || !body || !url || !cord || !hotel) {
			return res
				.status(422)
				.json({ error: "Server said: All feilds are compulsory" });
		}
		req.user.password = undefined;
		const food = new Food({
			title,
			body,
			photo : url,
			hotel,
			location: cord,
			postedBy: req.user,
		});
	
		food.save(food)
			.then((food) => {
				res.json({ food });
			})
			.catch((err) => {
				console.log("error while posting", err);
			});
	})
	.catch(ERR => console.log(ERR));
	// console.log(title,body,cord,photo);
	
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

	Food.findByIdAndUpdate(
		req.body.foodId,
		{
			$pull: { likes: req.user._id },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			console.log("ue", err);
			return res.status(422).json({ error: err });
		} 
		User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { likes: req.body.foodId },
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
