var mongoose = require('mongoose');

var tenantSchema = mongoose.Schema({
	workOrderCategory	: 	{ type: String },
	subject			: 	{ type: String },
	issue      : 	{ type: String },
	mobile				: 	{ type: String },
  email				: 	{ type: String },
	//status				: 	{ type: Number },
	//createdAt 			: 	{ type: Date, default: Date.now },
	//updatedAt 			: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', tenantSchema);
