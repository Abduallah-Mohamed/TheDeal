const {
    promisify
} = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');

// ? function to create a token
const signToken = (id) => {
    return JWT.sign({
            id,
        },
        process.env.JWT_SECRET
    );
};

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
        return next(createError(400, 'Please, Provide email and passwords fields'));
    }

    // ! Check if the password and email are correct
    const user = await User.findOne({
        email,
    }).select('+password');

    if (!user || !(await user.correctPasswords(password, user.password))) {
        return next(createError(404, 'Email or Password is not correct ... '));
    }

    // ! if all is good, send the token to the client
    const token = await signToken(user._id);

    res.status(200).json({
        success: true,
        token,
    });
});

//? protect middleware function
exports.protect = catchAsync(async(req, res, next) => {
    // ! Getting token and check if it is exist or not
    let token = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return (next(
            createError(401, 'you are not logged in')
        ));
    }

    // console.log(token);

    // ! Validate the token
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
        return next(createError(400, 'Token is Expired '));
    }

    // ! Check if the user is still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            createError(403, 'Please, Login again or do something else ... ')
        );
    }

    // ! Check if the user change his password after the token has been sent


    // ! Pass the current user in case we need it for middle ware
    req.user = currentUser;
    next();
});