const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
name: {
    type: String,
    unique: true,
    required: [true, 'tour name is required']
},

price: {
    type: Number,
    required: [true, 'Tour price is required']
},

rating: {
    type: Number,
    default: 4.5
}

})


module.exports = mongoose.model('Tour', tourSchema);