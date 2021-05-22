const dotenv = require(`dotenv`);
const fs = require(`fs`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const bcrypt = require(`bcrypt`);
const jwt = require (`jsonwebtoken`);
const morgan = require (`morgan`);
const mongoose = require (`mongoose`);
const hbs = require(`hbs`);
const User = require (`./models/user.js`);
const Portfolio = require (`./models/portfolio.js`);
const Review = require (`./models/review.js`);
const {checkUser} = require (`./middleware/authenticate.js`)
const saltrounds = 10;

port = process.env.PORT;
hostname = process.env.HOSTNAME;

const dbURL = `mongodb+srv://Arren:lasalle119@mp.if26f.mongodb.net/myFirstDatabase?retryWrites=true`
mongoose.connect (dbURL, {useNewUrlParser : true, useUnifiedTopology: true})
    .then ((result) => app.listen (port, ()=> {
        console.log (`Listening to port number ` + port);}))
    .catch ((err) => console.log (err));
	
const app = express();
app.set(`view engine`, `hbs`);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(`public`));
app.use(cookieParser());
app.use(checkUser);
app.use(morgan(`dev`));
hbs.registerPartials(__dirname + `/views/partials`);

dotenv.config();
const jwtsecret = process.env.JWTSECRET;

//ROUTES
app.get(`/`, (req, res) => {
	res.redirect(`/home`);
});

app.get(`/home`, (req, res) => {
	Portfolio.find({}, function(err, results)
	{
		console.log(results);
		res.render(`home`, {results});
	});
});

app.get(`/login`, (req, res) => {
	if(res.locals.user)
	{
		res.redirect (`/profileme`);
    }
	else
	{
		res.render(`login`);
	}
});

app.get(`/logout`, (req, res) => {
	res.cookie ('jwt', '', {maxAge: 1});
	res.redirect (`/home`);
});

app.get(`/register`, (req, res) => {
	res.render(`register`);
});

app.get(`/checkUsername`, (req, res) => {
	var username = req.query.username;
		
	User.findOne({username: username}, function(err, result) 
	{
		if(err)
		{
            console.log (err)
            res.send();
		}
		else
		{
			res.send(result);
		}
	});
});

app.get(`/portfolios`, (req, res) => {
	if(res.locals.user)
	{
		Portfolio.find({owner: res.locals.user.username}, function(err, results)
		{
			console.log(results);
			res.render(`portfolios`, {results});
		});
	}
	else
	{
		res.render(`login`);
	}
});

app.get(`/profileme`, (req, res) => {
	if(res.locals.user)
	{
		User.findOne({username: res.locals.user.username}, function(err, result)
		{
			if(err)
			{
				console.log (err)
				res.send();
			}
			else
			{
				res.render(`profile`, result);
			}
		});
    }
	else
	{
		res.render(`login`);
	}
});

app.get(`/profile/:username`, (req, res) => {
	var query = {username: req.params.username};
	User.findOne(query, function(err, result)
	{
		if(err)
		{
            console.log (err)
            res.send();
		}
		else
		{
			res.render(`profile`, result);
		}
	});
});

app.get(`/editprofile/:username`, (req, res) => {
	var query = {username: req.params.username};
	User.findOne(query, function(err, result)
	{
		if(err)
		{
            console.log (err)
            res.send();
		}
		else
		{
			if(res.locals.user)
			{
				if(res.locals.user.username == result.username)
				{
					res.render(`editprofile`, result);
				}
				else
				{
					res.redirect(`/error/user`);
				}
			}
			else
			{
				res.redirect(`/login`);
			}
		}
	});
});

app.get(`/changepassword/:username`, (req, res) => {
	if(res.locals.user)
	{
		if(res.locals.user.username = req.params.username)
		{
			res.render(`changepassword`, {username: req.params.username});
		}
		else
		{
			res.redirect(`/error/user`);
		}
	}
	else
	{
		res.redirect(`/login`);
	}
});

app.get(`/portfolio/:title`, (req, res) => {
	var query = {title: req.params.title};
	Portfolio.findOne(query, function(err, result)
	{
		Review.find({portfolio: result.title}, function(err, results)
		{
			var newmodel = 
			{
				title: result.title,
				owner: result.owner,
				type: result.type,
				genre: result.genre,
				stars: result.stars,
				desc: result.desc,
				date: result.date,
				art: result.art,
				avatar: result.avatar,
				review: results,
			}
				
			if(err)
			{
				console.log (err)
				res.send();
			}
			else
			{
				res.render(`portfolio`, newmodel);
			}
		});
	});
});

app.get(`/addportfolio`, (req, res) => {
	if(res.locals.user)
	{
		res.render(`addportfolio`);
	}
	else
	{
		res.render(`login`);
	}
});

app.get(`/editportfolio/:title`, (req, res) => {
	var query = {title: req.params.title};
	Portfolio.findOne(query, function(err, result)
	{
		if(err)
		{
			console.log (err)
			res.send();
		}
		else
		{
			if(res.locals.user)
			{
				if(res.locals.user.username == result.owner)
				{
					res.render(`editportfolio`, result);
				}
				else
				{
					res.redirect(`/error/user`);
				}
			}
			else
			{
				res.redirect(`/login`);
			}
		}
	});
});

app.get(`/checkTitle`, (req, res) => {
	var title = req.query.title;
		
	Portfolio.findOne({title: title}, function(err, result)
	{
		if(err)
		{
            console.log (err)
            res.send();
		}
		else
		{
			res.send(result);
		}
	});
});

app.get(`/editreview/:id`, (req, res) => {
	var id = req.params.id;
	
	Review.findById(req.params.id, function(err, result)
	{
		if(res.locals.user)
		{
			if(res.locals.user.username == result.reviewer)
			{
				var newmodel =
				{
					portfolio: result.portfolio,
					reviewer: result.reviewer,
					desc: result.desc,
					stars: result.stars,
					avatar: result.avatar,
					id: id,
				}
				res.render(`editreview`, newmodel);
			}
			else
			{
				res.redirect(`/error/user`);
			}
		}
		else
		{
			res.redirect(`/login`);
		}
	});
});

app.get(`/delete/:type/:name`, (req, res) => {
	switch(req.params.type)
	{
		case `profile`:		User.findOne({username: req.params.name}, function(err, result)
							{
								if(res.locals.user)
								{
									if(res.locals.user.username == result.username)
									{
										res.render(`delete`, {type: req.params.type, name: req.params.name});
									}
									else
									{
										res.redirect(`/error/user`);
									}
								}
								else
								{
									res.redirect(`/login`);
								}
							});
							break;
		case `portfolio`:	Portfolio.findOne({title: req.params.name}, function(err, resultp)
							{
								User.findOne({username: resultp.owner}, function(err, resultu)
								{
									if(res.locals.user)
									{
										if(res.locals.user.username == resultu.username)
										{
											res.render(`delete`, {type: req.params.type, name: req.params.name});
										}
										else
										{
											res.redirect(`/error/user`);
										}
									}
									else
									{
										res.redirect(`/login`);
									}
								});
							});
							break;
		case `review`:		Review.findById(req.params.name, function(err, resultr)
							{
								User.findOne({username: resultr.reviewer}, function(err, resultu)
								{
									if(res.locals.user)
									{
										if(res.locals.user.username == resultu.username)
										{
											res.render(`delete`, {type: req.params.type, name: req.params.name});
										}
										else
										{
											res.redirect(`/error/user`);
										}
									}
									else
									{
										res.redirect(`/login`);
									}
								});
							});
							break;
	}
});

app.get(`/error/:type`, (req, res) => {
	switch(req.params.type)
	{
		case `username`:	res.render(`error`, {error: `User does not exist`});
							break;
		case `password`:	res.render(`error`, {error: `Wrong password entered`});
							break;
		case `user`:		res.render(`error`, {error: `You are not the owner of that`});
							break;
		case `search`:		res.render(`error`, {error: `There are no results`});
							break;
		case `review`:		res.render(`error`, {error: `You cannot review your own work`});
							break;
	}
});

app.get(`/search`, function(req,res)
{
	var search = req.query.search;
	
	Portfolio.find({title: search}, function(err, results)
	{
		if(results.length)
		{
			var newmodel =
			{
				search: search,
				results: results,
			}
			res.render(`search`, newmodel);
		}
		else
		{
			res.redirect(`/error/search`);
		}
	});
});
//ROUTES

//BUTTONS
app.post(`/login/login`, function(req,res)
{
	var username = req.body.username;
	var password = req.body.password;
	var remember = req.body.remember;
	
	if(remember)
	{
		var time = `24h`;
	}
	else
	{
		var time = `1h`;
	}
	
	User.findOne({username: username}, function(err, result)
	{
		if(err)
		{
			console.log (err)
            res.send();
		}
		else
		{
			if(result)
			{
				bcrypt.compare(password, result.password, function (err, resultp)
				{
					if(err)
					{
						res.json ({error:err});
					}
					else
					{
						if(resultp)
						{
							let token = jwt.sign({id: result._id}, jwtsecret, {expiresIn: time});
							
							const cookieOptions = {httpOnly: true};
							
							cookieOptions.secure = true;
							res.cookie("jwt", token, cookieOptions);
							res.redirect ('/profile/' + username);
						}
						else
						{
							res.redirect ('/error/password'); 
						}
					}
				})
			}
			else
			{
				res.redirect ('/error/username');
			}
		}
	});
});

app.post(`/register/register`, function(req,res)
{
	bcrypt.hash(req.body.password, saltrounds, function(err, hashedPass)
	{
        if (err)
		{
            res.json({error: err});
        }
		
		var username = req.body.username;
		var name = req.body.name;
		
		var user = new User(
		{
			username: username,
			password: hashedPass,
			name: name,
			profession: ``,
			stars: 0,
			email: ``,
			birthday: ``,
			contactnumber: null,
			country: ``,
			address: ``,
			bio: ``,
			avatar: `/pics/profile pic.png`,
		});
		
		user.save();
	
		res.redirect(`/login`);
	});
});

app.post(`/editprofile/edit/:username`, function(req,res)
{
	var query = {username: req.params.username};
	var newusername = req.body.username;
	var newname = req.body.name;
	var newprofession = req.body.profession;
	var newemail = req.body.email;
	var newbirthday = req.body.birthday;
	var newnumber = req.body.contact;
	var newcountry = req.body.country;
	var newaddress = req.body.address;
	var newbio = req.body.description;
	
	if(req.body.file)
	{
		var newavatar = req.body.file;
	}
	else
	{
		var newavatar = `profile pic.png`;
	}
	
	User.updateOne(query,
	{
		username: newusername,
		name: newname,
		profession: newprofession,
		email: newemail,
		birthday: newbirthday,
		contactnumber: parseInt(newnumber),
		country: newcountry,
		address: newaddress,
		bio: newbio,
		avatar: `/pics/` + newavatar,
	}, function(err, result){});
	
	Portfolio.updateMany({owner: req.params.username},
	{
		owner: newusername,
		avatar: `/pics/` + newavatar,
	}, function(err, result){});
	
	Review.updateMany({reviewer: req.params.username},
	{
		reviewer: newusername,
		avatar: `/pics/` + newavatar,
	}, function(err, result){});
	
	res.redirect(`/profile/` + newusername);
});

app.post(`/changepassword/changepassword/:username`, (req, res) => {
	var query = {username: req.params.username};
	var oldpass = req.body.oldpassword;
	var newpass = req.body.newpassword;
	
	User.findOne(query, function(err, result)
	{
		if(err)
		{
			console.log(err)
            res.send();
		}
		else
		{
			bcrypt.compare(oldpass, result.password, function (err, resultp)
			{
				if(resultp)
				{
					User.updateOne(query,
					{
						password: bcrypt.hashSync(newpass, saltrounds)
					}, function(err, result){});
					
					res.redirect(`/profile/` + req.params.username);
				}
				else
				{
					res.redirect(`/error/password`);
				}
			})
		}
	});
});

app.post(`/addportfolio/addportfolio`, function(req,res)
{
	var title = req.body.title;
	var type = req.body.types;
	var genre = req.body.genre;
	var date = req.body.date;
	var description = req.body.desc;
	var newart = req.body.file;
	
	var portfolio = new Portfolio(
	{
		title: title,
		owner: res.locals.user.username,
		type: type,
		genre: genre,
		stars: 0,
		desc: description,
		date: date,
		art: `/pics/` + newart,
		avatar: res.locals.user.avatar,
	});
	
	portfolio.save();
	
	res.redirect(`/portfolio/` + title);
});

app.post(`/editportfolio/edit/:title`, function(req,res)
{
	var query = {title: req.params.title};
	var newtitle = req.body.title;
	var newtype = req.body.types;
	var newgenre = req.body.genre;
	var newdate = req.body.date;
	var newdescription = req.body.desc;
	
	Portfolio.updateOne(query,
	{
		title: newtitle,
		type: newtype,
		genre: newgenre,
		date: newdate,
		desc: newdescription,
	}, function(err, result){});
	
	Review.updateMany({portfolio: req.params.title},
	{
		portfolio: newtitle,
	}, function(err, result){});
	
	res.redirect(`/portfolio/` + newtitle);
});

app.get(`/postreview`, function(req,res)
{
	if(res.locals.user)
	{
		var title = req.query.title;
		var description = req.query.desc;
		var stars = req.query.stars;
		
		var newreview = new Review(
		{
			portfolio: title,
			reviewer: res.locals.user.username,
			desc: description,
			stars: parseInt(stars),
			avatar: `/pics/profile pic.jpg`,
		});
		
		newreview.save();
		
		Portfolio.findOne({title: title}, function(err, resultp)
		{
			Portfolio.updateOne({title: resultp.title},
			{
				stars: resultp.stars + parseInt(stars),
			}, function(err, result){});
		});	
		
		Portfolio.findOne({title: title}, function(err, resultp)
		{
			User.findOne({username: resultp.owner}, function(err, resultu)
			{
				User.updateOne({username: resultu.username},
				{
					stars: resultu.stars + parseInt(stars),
				}, function(err, result){});
			});
		});
				
		res.render(`partials/review`, newreview, function(err, html)
		{
			if(err)
			{
				return err;
			}
			return res.send(html);
		});
	}
	else
	{
		res.render(`login`);
	}
});

app.post(`/editreview/:id`, function(req,res)
{
	var portfolio = req.body.portfolio;
	var desc = req.body.desc;
	var oldstars = req.body.oldstars;
	var stars = req.body.stars;
	
	Portfolio.findOne({title: portfolio}, function(err, result)
	{
		if(oldstars >= stars)
		{
			var newstars = (result.stars - (oldstars - stars));
		}
		else if(oldstars < stars)
		{
			var newstars = result.stars + (stars - oldstars);
		}
		
		Portfolio.updateOne({title: result.title},
		{
			stars: newstars,
		}, function(err, result){});
	});
	
	Review.findByIdAndUpdate(req.params.id, 
	{
		$set:
		{
			desc: desc,
			stars: stars,
		}
	}, function(err, result){});
	
	res.redirect(`/portfolio/` + portfolio);
});

app.post(`/delete/delete/:type/:name`, function(req,res)
{
	var type = req.params.type;
	var name = req.params.name;
	var password = req.body.password
	
	bcrypt.compare(password, res.locals.user.password, function (err, result)
	{
		if(result)
		{
			switch(type)
			{
				case `profile`:		User.deleteOne({username: name}, function(err, result){});
									Portfolio.deleteMany({owner: name}, function(err, result){});
									Review.deleteMany({reviewer: name}, function(err, result){});
									res.redirect(`/logout`);
									break;
				case `portfolio`:	Portfolio.findOne({title: name}, function(err, resultp)
									{
										User.findOne({username: resultp.owner}, function(err, resultu)
										{
											User.updateOne({username: resultp.owner},
											{
												stars: resultu.stars - resultp.stars,
											}, function(err, result){});
										});
									});
									Portfolio.deleteOne({title: name}, function(err, result){});
									Review.deleteMany({portfolio: name}, function(err, result){});
									res.redirect(`/home`);
									break;
				case `review`:		Review.findById(name, function(err, resultr)
									{
										Portfolio.findOne({title: resultr.portfolio}, function(err, resultp)
										{
											Portfolio.updateOne({title: resultr.portfolio},
											{
												stars: resultp.stars - resultr.stars,
											}, function(err, result){});
										});
									});
									Review.findByIdAndDelete(name, function(err, result){});
									res.redirect(`/home`);
									break;
			}
			
		}
		else
		{
			res.redirect(`/error/password`);
		}
	});
});
//BUTTONS