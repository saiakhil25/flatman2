var async = require('async');
var FOS = require('../models/fos');
var User = require('../models/user');
var Location = require('../models/location');
var crypto = require('../config/crypto');

module.exports = function(router, upload) {

	// get all fos(s)
	router.get('/fos/all', function(req, res) {
		FOS.find({}, function(err, fosList) {
			if(err)
				res.json({success: false, error: err.stack});
			res.json({success: true, data: fosList});
		});
	});

	// get one fos
	router.get('/fos/:id', function(req, res) {
		var data = {}
		async.waterfall([
			function(callback) {
				FOS.findById(req.params.id, function(err, fos) {
			        if(err) {
						callback(err)
					}
					else {
						data["basicInfo"] = fos;
			        	callback(null, data);
					}
			    });
			}
		], function(err, data) {
			if(err) {
				res.json({success: true, error: err})
			}
			else {
				res.json({success: true, fosInfo: data});
			}
		})
	});

	var newUpload = upload.single('avatar');
	router.post('/fos/create', function(req, res) {
		newUpload(req, res, function(error) {
			if(error) {
				res.json({success: false, message: "File too large, maximum size 1 MB"});
			}
			else {
				req.body.avatar = req.file.path;
				User.findOne({email: req.body.email}, function(err, user) {
					if(err) {
						res.json({success: false, error: err.stack});
					}
					if(user) {
						res.json({success: false, message: "Email already exist"});
					}
					else {
						var newUser = new User();
						newUser.email = req.body.email;
						newUser.password = crypto.encrypt(req.body.password);;
						newUser.firstName = req.body.firstName;
						newUser.lastName = req.body.lastName;
						newUser.avatar = req.body.avatar;
						newUser.mobile = req.body.mobile;
						newUser.userRole = 5;
						newUser.status = 1;
						newUser.save(function(err, user){
							if(err) {
								res.json({success: false, message: "Error in creating user", error: err.stack})
							} else {
								addFOS(req.body, function(response) {
									if(response.success) {
										res.json({success: true, message: "New fos created."})
									}
									else {
										deleteUser(user._id, function(resp) {
											if(response.success) {
												res.json({success: false, message: "Error in creating fos.", error: err.stack});
											}
											else {
												res.json({success: false, message: "Error in creating doctor."});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	});

	router.post('/fos/update', function(req, res) {
		delete req.body["avatar"];
		FOS.findByIdAndUpdate(req.body._id, {$set: req.body}, function(err) {
			if(err) {
				res.json({success: false, error: err.stack});
			}
			else {
				res.json({success: true, message: "FOS Updated."});
			}
		});
	})

	function addFOS(fos, callback) {
		var newFOS = new FOS();
		newFOS.firstName = fos.firstName
		newFOS.lastName = fos.lastName
		newFOS.avatar = fos.avatar
		newFOS.address = fos.address
		newFOS.mobile = fos.mobile
		newFOS.alternateMobile = fos.alternateMobile
		newFOS.emergencyMobile = fos.emergencyMobile
		newFOS.email = fos.email
		newFOS.password = fos.password
		newFOS.status = 1
		newFOS.save(function(err) {
			if(err)
				callback({success: false, error: err.stack})
			callback({success: true, message: "New FOS created."})
		})
	}

	function deleteUser(userId, callback) {
		User.remove({_id: userId}, function(err, removedUser) {
			if(err)
				callback({success: false, message: "Error in deleting user", error: err.stack});
			callback({success: true})
		})
	}

}
