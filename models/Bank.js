const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
	bankName: {
		type: String,
		required: true,
	},
	accountNumber: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Bank', bankSchema);
