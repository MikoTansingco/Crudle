const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type : String,
        required : true
    },

    password: {
        type : String,
        required : true
    },

    name: {
        type : String,
        required : true
    },
	
	profession: {
        type : String
    },

    stars: {
        type : Number
    },

    email: {
        type : String
    },
	
	birthday: {
        type : String
    },

    contactNumber: {
        type : Number
    },

    country: {
        type : String
    },

    address: {
        type : String
    },
	
	bio: {
        type : String
    },

    avatar: {
        type : String
    },
}, {timestamps : true});

if (mongoose.models.User)
{
    User = mongoose.model('User');
}
else
{
	User = mongoose.model('User', userSchema);
}

module.exports = User;