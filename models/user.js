const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportlocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// UserSchema.plugin(passportlocalMongoose);

// module.exports = mongoose.model("User", UserSchema);
mongoose.model("User", UserSchema);
