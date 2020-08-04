const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const createError = require('../utils/appError');

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();

    if (!users) {
        return next(
            createError(404, 'There is no users ')
        )
    }
    res.status(200).json({
        message: 'All users got successfully ...',
        success: true,
        data: {
            users
        }
    })
});


exports.getSingleUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            createError(404, 'this id is not exist')
        )
    }

    res.status(200).json({
        message: 'Got single user successfully ... ',
        success: true,
        data: {
            user
        }
    });
});

exports.deleteSingleUser = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(
            createError(404, 'this id is not exist')
        )
    }

    res.status(200).json({
        message: 'deleted successfully',
        success: true,
        data: {
            user
        }
    });
});