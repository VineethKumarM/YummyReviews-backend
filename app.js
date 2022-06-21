const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 5000
const { MONGOURI } = require("./config/keys");
require("./models/user");
require("./models/food");

const db='mongodb+srv://newadmin:admin123@reviews.zi9fk.mongodb.net/?retryWrites=true&w=majority'
mongoose
	.connect(
		db,
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
		console.log("error ",err);
	});


	app.use(express.json({ limit: "50mb" }));
app.use(
	express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => {
	console.log("Serving on port ",PORT);
});
