const { Schema, model } = require("mongoose");
const { nanoid } = require("nanoid");

const shortUrlSchema = new Schema(
	{
		URLFull: {
			type: String,
			required: true,
			unique: true,
		},
		URLShort: {
			type: String,
			unique: true,
			default: nanoid(6),
			required: true,
		},
		visits: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const ShortUrl = model("ShortUrl", shortUrlSchema);

module.exports = ShortUrl;
