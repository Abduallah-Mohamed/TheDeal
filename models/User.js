const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Your Name Must Be Provided, Please!'],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Please, Add Your Email Address.'],
        unique: [true, 'This Email address Is in use already'],
        validate: [validator.isEmail, 'Please Add a Valid Email !'],
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'product owner'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please, Provide Good Password.'],
        minlength: [8, 'too few characters for the password'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please, Provide the confirm password field'],
        validate: {
            //! works only on CREATE and SAVE
            validator: function(v) {
                return v === this.password;
            },
            message: 'the two passwords are not the same',
        },
    },
    forgotPassword: String,
    expiredPassword: Date,
    passwordChangedAt: Date
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

//? make a middleware for hashing the password
userSchema.pre('save', async function(next) {
    //* only run this function if password was actually modified
    if (!this.isModified('password')) next();

    //* hashing the password using bcryptjs package
    this.password = await bcrypt.hash(this.password, 12);

    //* then we delete the confirmPassword field
    this.confirmPassword = undefined;

    next();
});

// ? middleware to determine when the user has changed his password
userSchema.pre('save', function(next) {
    // ! if there is no modification on the password field and the document is new do the next if
    if (!this.isModified('password') || this.isNew) return next();

    // ! if not what above put the Passwordchabgedat property to the document 
    this.passwordChangedAt = Date.now() - 1000;

    next()
})

//! method to correct passwords.
userSchema.methods.correctPasswords = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// populate the user with reviews
userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'user',
    localField: '_id',
});

userSchema.methods.forgotPasswordFunction = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.forgotPassword = crypto.createHash('sha256').update(token).digest('hex');

    this.expiredPassword = Date.now() + 10 * 60 * 1000;

    return token;
}

module.exports = mongoose.model('User', userSchema);