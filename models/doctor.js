var mongoose = require('mongoose');

var doctorSchema = mongoose.Schema({
	workordercategory			: 	{ type: String },
	subject		: 	{ type: String },
	//lastName			: 	{ type: String },
	//avatar				: 	{ type: String },
	//specializationId	: 	{ type: String },
	//residentialAddress	: 	{ type: String },
	mobile				: 	{ type: String },
	flatno		: 	{ type: String },
	email				: 	{ type: String },
	issues		: 	{ type: String },
	//password			:   { type: String },	
	status				: 	{ type: Number },
	createdAt 			: 	{ type: Date, default: Date.now },
	updatedAt 			: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
