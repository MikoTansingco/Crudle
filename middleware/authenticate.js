const jwt = require (`jsonwebtoken`)
const User = require (`../models/user.js`);
const dotenv = require (`dotenv`);
const { promisify } = require("util");

dotenv.config();
const jwtsecret = process.env.JWTSECRET;

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token)
	{
		jwt.verify(token, jwtsecret , (err, decodedToken) => {
			if(err)
			{
				res.locals.user = null;
				next();
			}
			else
			{
				//var id = new ObjectId(decodedToken.id);
				
				User.findById(decodedToken.id, function(err, result)
				{
					res.locals.user = result;
					next();
				});
			}
		});
    }
	else
	{
		res.locals.user = null;
		next();
    }
};

module.exports = {
    checkUser
};