var LocalStrategy 	= require('passport-local').Strategy;
var User 			= require('../models/user');
var Customer 		= require('../models/customer');
var crypto 			= require('./crypto');

module.exports = function(passport) {

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	// admin signup
	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({'email': email}, function(err, user){
					if(err)
						return done(err);
					if(user){
						return done(null, false, req.flash('signupMessage', 'That email already taken'));
					} else {
						var newUser = new User();
						newUser.email = email;
						newUser.password = crypto.encrypt(password);
						newUser.firstName = req.body.first_name;
						newUser.lastName = req.body.last_name;
						newUser.mobile = req.body.mobile;
						newUser.userRole = 1;
						newUser.status = 1;
						newUser.save(function(err){
							if(err)
								throw err;
							return done(null, newUser);
						})
					}
				})

			});
		}
	));

	// login
	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({'email': email, 'status': 1}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(user.password != crypto.encrypt(password)){
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, user);
				});
			});
		}
	));

	// customer signup
	passport.use('customer-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({'email': email}, function(err, user){
					if(err)
						return done(err);
					if(user){
						return done(null, false, req.flash('signupMessage', 'That email already taken'));
					} else {
						var newUser = new User();
						newUser.email = email;
						newUser.password = crypto.encrypt(password);
						newUser.firstName = req.body.first_name;
						newUser.lastName = req.body.last_name;
						newUser.mobile = req.body.mobile;
						newUser.userRole = 2;
						newUser.status = 1;
						newUser.save(function(err){
							if(err) {
								throw err;
							} else {
								addCustomer(req.body, function(response) {
									return done(null, newUser);
								})
							}
						})
					}
				})

			});
		}
	));

	function addCustomer(customer, callback) {
		var newCustomer = new Customer();
		newCustomer.firstName = customer.first_name;
		newCustomer.lastName = customer.last_name;
		newCustomer.location = customer.location;
		newCustomer.mobile = customer.mobile;
		newCustomer.email = customer.email;
		newCustomer.serviceLocation = customer.service_location;
		newCustomer.status = customer.status;

		newCustomer.save(function(err) {
			if(err)
				callback({success: false, error: err.stack})
			callback({success: true, message: "New customer created."})
		})
	}

}
