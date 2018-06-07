var async = require('async');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var Location = require('../models/location');
var crypto 	= require('../config/crypto');

module.exports = function(router, upload) {

	router.get('/tenants/all', function(req, res) {
		Tenant.find({}, function(err, tenants) {
			if(err)
				res.json({success: false, error: err.stack});
			res.json({success: true, data: tenants});
		});
	});

	// GET patient by customerId
	router.get('/Tenant/:customerId', function(req, res) {
		Tenant.find({customerId: req.params.customerId}, function(err, Tenant) {
			if(err)
				res.json({success: false, error: err.stack});
			res.json({success: true, data: tenant});
		});
	});

	router.get('/tenant/get-tenant-by-id/:tenantId', function(req, res) {
		var tenantInfoObject = {};
		async.waterfall([
			function(callback) {
				Tenant.findOne({_id: req.params.tenantId}, function(err, tenant) {
					if(err){
						callback(err);
					}
					else if(tenant == null) {
						callback(null, undefined);
					}
					else {
						tenantInfoObject["basicInfo"] = tenant;
						callback(null, tenant);
					}
				});
			},
			function(tenant, callback) {
				if(tenant !== undefined) {
					Location.findOne({_id: tenant.locationId}, function(err, location) {
						if(err) {
							callback(err);
						}
						else {
							tenantInfoObject["locationInfo"] = location;
							callback(null, tenantInfoObject);
						}
					})
				}
				else {
					callback(null, tenantInfoObject);
				}
			}
		], function(err, tenantInfoObject) {
			if(err) {
				res.json({success: false, error: err.stack});
			}
			else {
				res.json({success: true, data: tenantInfoObject});
			}
		})

	})

	//var newUpload = upload.single('avatar');
	router.post('/tenant/create', function(req, res) {
		//newUpload(req, res, function(error) {
			// if(error) {
			// 	res.json({success: false, message: "File too large, maximum size 1 MB"});
			// }
		//	else {
			//	req.body.avatar = req.file.path;
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
						//newUser.password = crypto.encrypt(req.body.password);
						//newUser.firstName = req.body.firstName;
						//newUser.lastName = req.body.lastName;
						newUser.workordercategory = req.body.workordercategory;
						newUser.mobile = req.body.mobile;
						newUser.subject = req.body.subject;
						newUser.issue = req.body.issue;
						//newUser.flatno = req.body.flatno;
						//newUser.avatar = req.body.avatar;
						newUser.userRole = 3;
						newUser.status = 1;
						newUser.save(function(err, user){
							if(err) {
								res.json({success: false, message: "Error in creating user", error: err.stack})
							} else {
								addTenant(req.body, function(response) {
									if(response.success) {
										res.json({success: true, message: "New User created."})
									}
									else {
										deleteUser(user._id, function(resp) {
											if(response.success) {
												res.json({success: false, message: "Error in creating patient.", error: err.stack});
											}
											else {
												res.json({success: false, message: "Error in creating patient."});
											}
										});
									}
								});
							}
						});
					}
				});
		//	}
	//	})
	});

	router.post('/tenant/update', function(req, res) {
		var tenantInfoObj = {
			//firstName: req.body.firstName,
			//lastName: req.body.lastName,
			//locationId: req.body.locationId,
			workordercategory:req.body.workordercategory,
      subject:req.body.subject,
			email: req.body.email,
			mobile: req.body.mobile,

			issue : req.body.issue
			//flatno : req.body.flatno,
			//address: req.body.address
		};
		Tenant.findByIdAndUpdate(req.body._id, {$set: tenantInfoObj}, function(err) {
			if(err) {
				res.json({success: false, error: err.stack});
			}
			else {
				res.json({success: true, message: "Patient Updated."});
			}
		});
	})

	function addTenant(tenant, callback) {
		var newTenant = new Tenant();
		//newPatient.firstName = patient.firstName;
		//newPatient.lastName = patient.lastName;
		//newPatient.avatar = patient.avatar;
		newTenant.workordercategory = tenant.workordercategory;
		newTenant.subject = tenant.subject;
		newTenant.mobile = tenant.mobile;
		newTenant.email = tenant.email;
		newTenant.issue = tenant.issue;
		//newPatient.flatno = patient.flatno;
		//newPatient.locationId = patient.locationId;
	//	newPatient.customerId = patient.customerId;
	//	newPatient.address = patient.address;
		newTenant.status = 1;
		newTenant.isVerified = 0;
		newTenant.save(function(err) {
			if(err)
				callback({success: false, error: err.stack});
			callback({success: true, message: "New User created."});
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
