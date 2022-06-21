const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
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
	photo: {
		type: String,
		default: "./images/profile.jpg"
	},
	favourites: [
		{
			type: ObjectId,
			ref: "Food",
		},
	],
	likes: [
		{
			type: ObjectId,
			ref: "Food",
		},
	],
	social: [
		{
			site: {
				type:String,
			},
			link: {
				type: String,
			}
		}
	],
});

// UserSchema.plugin(passportlocalMongoose);

// module.exports = mongoose.model("User", UserSchema);
mongoose.model("User", UserSchema);
