const { JWT_Secret } = require("../config/keys");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
	// console.log("hello\n");
	// console.log(req.headers, "\n");
	const { authorization } = req.headers;
	if (!authorization) {
		res.status(401).json({ error: "you must be logged in" });
	}
	// console.log(authorization);
	const token = authorization.replace("Bearer ", "");
	jwt.verify(token, JWT_Secret, (err, payload) => {
		if (err) {
			return res.status(401).json({ error: "you must be logged in" });
		}
		const { _id } = payload;
		User.findById(_id).then((userdata) => {
			// console.log(userdata);
			req.user = userdata;
			next();
		});
		// next();
	});
};
