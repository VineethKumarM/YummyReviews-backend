const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const foodSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: true,
	},
	hotel: {
		type: String,
		required: true,
	},
	likes: [
		{
			type: ObjectId,
			ref: "User",
		},
	],
	location: {
		type: {
			type: String, 
			enum: ['Point'], 
			required: true
		},
			coordinates: {
			type: [Number],
			required: true
		}
	},
	postedBy: {
		type: ObjectId,
		ref: "User",
	},
	favs: {
		type: Number,
		default: 0,
	}
});

mongoose.model("Food", foodSchema);
