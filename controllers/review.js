const createError = require('http-errors');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/Review');


exports.getAllReviews = catchAsync(async(req, res, next) => {
    const reviews = await Review.find();

    if (!reviews) {
        return next(new createError(404, 'There is no Review!'));
    }

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: {
            reviews
        }
    });
});

//  Create New review
exports.createReview = catchAsync(async(req, res, next) => {
    const review = await Review.create(req.body);

    if (!review) {
        return next(new createError(404, 'There is no review created'));
    }

    res.status(201).json({
        data: review
    });
});

// delete the review using id
exports.deleteReview = catchAsync(async(req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new createError(404, 'There is no review to delete'));
    }

    res.status(204).json({
        message: true,
        data: review
    });
});