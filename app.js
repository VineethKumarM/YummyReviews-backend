const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const { MONGOURI } = require("./keys");
require("./models/user");
require("./models/food");

mongoose
	.connect(
		"mongodb://localhost:27017/reviews",
		// "mongodb+srv://admin:admin@cluster0.g2cs2.mongodb.net/?retryWrites=true&w=majority",

		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("connection established!");
	})
	.catch((err) => {
		console.log("error");
		console.log(err);
	});

const middle = (req, res, next) => {
	next();
};

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(express.json({ limit: "50mb" }));
app.use(
	express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.get("/", (req, res) => {
	console.log("new request");
	res.send("worked");
});

app.get("/profile", middle, (req, res) => {
	res.send("profile page");
});

app.listen(3009, () => {
	console.log("Serving on port 3009");
});
