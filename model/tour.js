const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'tour name is required']
},

duration: {
    type: Number,
    required:[true, 'A duration is required']

},

maxGroupSize: {
    type: Number,
    required:[true, 'Maximum size of group in a tour is required'],
    default: 10

},

price: {
    type: Number,
    required: [true, 'Tour price is required']
},

difficulty: {
    type: String,
    required: [true, 'Tour difficulty is required']
},

ratingsAverage: {
    type: Number,
    default: 4.5
},
ratingsQuantity: {
    type: Number,
    default: 0
},

Discount: Number,

summary: {
    type: String,
    required: [true, 'Tour description is required'],
    trim: true,
},

description: {
    type: String,
    trim: true
},

imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
},

images: [String],

createdAt: {
    type: Date,
    default: Date.now()
},

startDate: [Date]

    
});



module.exports = mongoose.model('Tour', tourSchema);