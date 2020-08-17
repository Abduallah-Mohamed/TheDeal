const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const createError = require('../utils/appError');

// const stripe = require('stripe')('sk_test_51HFof0Byvx3bdIybgyLhCkUwm6U44mpxBvycdtPkX7OYdQD4hRssq2d9S8IgB8T65OdjROE5bizNgJv63SrMNZje00EgHOIhoA');

// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 1099,
//   currency: 'usd',
//   // Verify your integration in this guide by including this parameter
//   metadata: {integration_check: 'accept_a_payment'},
// });

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();

    if (!users) {
        return next(createError(404, 'There is no users '));
    }
    res.status(200).json({
        message: 'All users got successfully ...',
        success: true,
        data: {
            users,
        },
    });
});

exports.getSingleUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id).populate('reviews');

    if (!user) {
        return next(createError(404, 'this id is not exist'));
    }

    res.status(200).json({
        message: 'Got single user successfully ... ',
        success: true,
        data: {
            user,
        },
    });
});

exports.deleteSingleUser = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(createError(404, 'this id is not exist'));
    }

    res.status(200).json({
        message: 'deleted successfully',
        success: true,
        data: {
            user,
        },
    });
});