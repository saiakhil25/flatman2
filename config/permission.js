module.exports = function(...allowed) {
	const isAllowed = role => allowed.indexOf(role) > -1;
	// return a middleware
  	return (req, res, next) => {
    	if (req.user && isAllowed(req.user.userRole))
      		next(); // role is allowed, so continue on the next middleware
    	else {
      		res.status(403).json({success: false, message: "Forbidden"}); // user is forbidden
    	}
  	}

 }