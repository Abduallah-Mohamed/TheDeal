const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const createError = require('../utils/appError');
const JWT = require('jsonwebtoken');

// ? function to create a token
const signToken = id => {
    return JWT.sign({
        id
    }, process.env.JWT_SECRET);
}

// create new user
exports.signup = catchAsync(async(req, res, next) => {
    const user = await User.create(req.body);

    const token = await signToken(user._id);

    console.log(token);
    res.status(201).json({
        message: 'Created New User successfully ... ',
        success: true,
        data: {
            user,
        },
    });
});

// ? login the user to our system
exports.login = catchAsync(async(req, res, next) => {
    const {
        email,
        password
    } = req.body;

    // ! Check if password and email are entered by the user or not
    if (!email || !password) {
        return next(
            createError(400, 'Please, Provide email and passwords fields')
        )
    }

    // ! Check if the password and email are correct
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user || !(await user.correctPasswords(password, user.password))) {
        return next(
            createError(404, 'Email or Password is not correct ... ')
        )
    }

    // ! if all is good, send the token to the client
    const token = await signToken(user._id);

    res.status(200).json({
        success: true,
        token
    })
});