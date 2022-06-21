const { JWT_SECRET } = require("../config/keys");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {

	const { authorization } = req.headers;
	if (!authorization) {
		res.status(401).json({ error: "you must be logged in" });
	}
	console.log(authorization);
	const token = authorization.replace("Bearer ", "");
	jwt.verify(token, JWT_SECRET, (err, payload) => {
		if (err) {
			console.log('login error');
			return res.status(401).json({ error: "you must be logged in" });
		}
		const { _id } = payload;
		User.findById(_id).then((userdata) => {
			req.user = userdata;
			console.log('validated');
			next();
		});
	});
};
