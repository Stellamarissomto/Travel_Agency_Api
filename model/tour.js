const mongoose = require("mongoose");
const slugify = require("slugify");

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
    enum: {
         values:  ['easy', 'medium', 'difficult'],
         message: 'Difficulty can only be set to easy, medium and difficuly'
},
    required: [true, 'Tour difficulty is required']
},

ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must not be below 1.0'],
    max: [5, 'Rating must not be above 5']
},
ratingsQuantity: {
    type: Number,
    default: 0
},

Discount: {
    type: Number,
    validate: {
        validator: function(value){
            return value < this.price // return the value only when price is greater than discount

        },
        message: 'Discount can not be greater than the regular price'
        
    }
},
slug: String,
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
    default: Date.now(),
    select: false
},

startDate: [Date],
secretTour: {
    type: Boolean,
    default: false
},
},
{
    toJSON: { virtuals: true},
    toObject: { virtual: true}
}

);

tourSchema.virtual('durationWeek').get( function(){
    return this.duration / 7;

});

// ocument middleware that rus b4 .save() or .create
tourSchema.pre('save', function(next) {
 this.slug = slugify(this.name, { lower: true});

 next();   
});

// query middleware
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true}});
    next();
})

module.exports = mongoose.model('Tour', tourSchema);