const express = require('express');
const {
    getAllUsers,
    getSingleUser,
    deleteSingleUser
} = require('../controllers/users');
const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require('../controllers/auth');
const router = express.Router();

// create new user 
router.post('/signup', signup);
// login user
router.post('/login', login);
// logout user
router.get('/logout', logout);
// forgot Password
router.post('/forgotPassword', forgotPassword);
// Reset Password
router.patch('/resetPassword/:token', resetPassword);

/* GET users listing. */
router.route('/').get(getAllUsers);

router.route('/:id').get(getSingleUser).delete(deleteSingleUser);


module.exports = router;