var mongoose = require('mongoose');

var patientSchema = mongoose.Schema({
	firstName		: 	{ type: String },
	lastName		: 	{ type: String },
	avatar			: 	{ type: String },
	age				: 	{ type: String },
	locationId		: 	{ type: String },
	email			: 	{ type: String },
	mobile			: 	{ type: String },
	address			: 	{ type: String },
	password		:   { type: String },
	flatno 			: 	{type: String},
	customerId		: 	{ type: String },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
