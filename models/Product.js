const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the name of the product !!']
    },
    price: {
        type: Number,
        required: [true, 'Please add the price of the product !!!']
    },
    weight: {
        type: Number,
        default: 100
    },
    description: {
        type: String,
        required: [true, 'Please, state the specs of the product !!!']
    },
    SKU: {
        type: String,
        required: [true, 'Please add the SKU for the product']
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

/**
 * i willl do virtual populate to get all the reviews for each Product
 * because i made the parent reference which the product (parent) does NOT know anything about his Children (Reviews)
 */
ProductSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});


module.exports = mongoose.model('Product', ProductSchema);