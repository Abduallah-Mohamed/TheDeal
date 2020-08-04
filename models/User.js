const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
            validator: function (v) {
                return v === this.password;
            },
            message: 'the two passwords are not the same',
        },
    },
});

//? make a middleware for hashing the password
userSchema.pre('save', async function (next) {
    //* only run this function if password was actually modified
    if (!this.isModified('password')) next();

    //* hashing the password using bcryptjs package
    this.password = await bcrypt.hash(this.password, 12);

    //* then we delete the confirmPassword field
    this.confirmPassword = undefined;

    next();
});

//! method to correct passwords.
userSchema.methods.correctPasswords = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

module.exports = mongoose.model('User', userSchema);