const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    portfolio: {
        type : String,
        required : true
    },

    reviewer: {
        type : String,
        required : true
    },

    desc: {
        type : String
    },

    stars: {
        type : Number
    },

    avatar: {
        type : String
    },
}, {timestamps : true});

if (mongoose.models.Review)
{
    Review = mongoose.model(`Review`);
}
else
{
	Review = mongoose.model(`Review`, reviewSchema);
}

module.exports = Review;