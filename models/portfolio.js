const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    title: {
        type : String,
        required : true
    },

    owner: {
        type : String,
        required : true
    },

    type: {
        type : String
    },
	
	genre: {
        type : String
    },

    stars: {
        type : Number
    },

    desc: {
        type : String
    },
	
	date: {
        type : String
    },

    art: {
        type : String
    },

    avatar: {
        type : String
    },
	
}, {timestamps : true});

if (mongoose.models.Portfolio)
{
    Portfolio = mongoose.model(`Portfolio`);
}
else
{
	Portfolio = mongoose.model(`Portfolio`, portfolioSchema);
}

module.exports = Portfolio;