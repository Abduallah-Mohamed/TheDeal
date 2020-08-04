const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: ['true', 'review must belong to the user .']
    }
});

// reviewSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'product',
//     });
//     next();
// })

module.exports = mongoose.model('Review', reviewSchema);