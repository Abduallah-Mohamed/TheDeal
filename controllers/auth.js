const {
    promisify
} = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

//? logout functionality
exports.logout = (req, res) => {
    req.logout();
    res.json(200).json({
        message: 'Logged out successfully ... ',
    });
};

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
        return next(createError(401, 'you are not logged in'));
    }

    // console.log(token);

    // ! Validate the token
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
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
    // we will apply this later ISA

    // ! Pass the current user in case we need it for middle ware
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(createError(403, 'You are not allowed to do so .... '));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
    //! get the user data according to email entered by the user
    const {
        email
    } = req.body;
    const user = await User.findOne({
        email
    });
    if (!user || !email) {
        return next(createError(404, 'Email not found, Please check'));
    }

    //! generate the token
    const token = user.forgotPasswordFunction();
    await user.save({
        validateBeforeSave: false
    });


    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${token}`;
    const message = `Forgot Your Password? Submit a PATCH request with your new password and password confirmation to: ${resetURL}.\n If you did not ask for reset password please IGNORE this Email`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your Password Reset is valid for (10) minutes',
            message
        });
        res.json({
            message: 'Email sent',
            token,
        });
    } catch (err) {
        console.log(err);
        console.log(err.stack)
        user.forgotPassword = undefined;
        user.expiredPassword = undefined;
        await user.save({
            validateBeforeSave: false
        });
        return next(createError(404, 'there is an error happened'))
    }
});

// ! Reset Password Functionality
exports.resetPassword = catchAsync(async(req, res, next) => {
    //? 1) get the user based on the token that we sent with URL(Email)
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(hashedToken);
    const user = await User.findOne({
        forgotPassword: hashedToken,
        expiredPassword: {
            $gt: Date.now()
        }
    });

    console.log(user);

    //? 2) If the Token is not expired and the user is found, reset the password
    if (!user) {
        return next(createError(404, 'User not found'))
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.forgotPassword = undefined;
    user.expiredPassword = undefined;
    await user.save();

    //? 3) Update the ChangedPasswordAt property for the user
    // ! we did 3) as a middleware in the user model 

    //? 3) Log the user In, Send JWT
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});