var mongoose = require('mongoose');

var monitorSchema = mongoose.Schema({
	workOrderCategory	: 	{ type: String },
	subject			: 	{ type: String },
	issue      : 	{ type: String },
	mobile				: 	{ type: String },
  email				: 	{ type: String },
	graduationYear		: 	{ type: String },
	status				: 	{ type: Number },
	createdAt 			: 	{ type: Date, default: Date.now },
	updatedAt 			: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Monitoring', monitorSchema);
