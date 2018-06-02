var mongoose = require('mongoose');

var fosSchema = mongoose.Schema({
	firstName		: 	{ type: String },
	lastName		: 	{ type: String },
	avatar			: 	{ type: String },
	address			: 	{ type: String },
	email			: 	{ type: String },
	mobile			: 	{ type: String },
	alternateMobile	: 	{ type: String },
	emergencyMobile	: 	{ type: String },
	password		:   { type: String },
	status			:   { type: Number },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('FOS', fosSchema);
