var mongoose = require('mongoose');

var assignFOSSchema = mongoose.Schema({
	fosId		    : 	{ type: String },
	patientId		: 	{ type: String },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignFOS', assignFOSSchema);
