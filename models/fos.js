// var mongoose = require('mongoose');
//
// var fosSchema = mongoose.Schema({
// 	workordercategory		: 	{ type: String },
// 	subject		: 	{ type: String },
// 	issues			: 	{ type: String },
// 	email			: 	{ type: String },
// 	mobile			: 	{ type: String },
// 	flatno      : { type:String },
// 	status			:   { type: Number },
// 	createdAt 		: 	{ type: Date, default: Date.now },
// 	updatedAt 		: 	{ type: Date, default: Date.now }
// });
//
// module.exports = mongoose.model('FOS', fosSchema);


var mongoose = require('mongoose');

var fosSchema = mongoose.Schema({
	//firstName		: 	{ type: String },
	//lastName		: 	{ type: String },
	//avatar			: 	{ type: String },
	workordercategory : {type: String },
  subject	: 	{ type: String },
	email			: 	{ type: String },
	mobile			: 	{ type: String },
	flatno	: 	{ type: String },
	issues			: 	{ type: String },
	specializationId :{ type: String },
	//password		:   { type: String },
	status			:   { type: Number },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('FOS', fosSchema);
