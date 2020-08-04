const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    createReview,
    deleteReview
} = require('../controllers/review');

router.route('/reviews').get(getAllReviews).post(createReview);
router.route('/reviews/:id').delete(deleteReview);



module.exports = router;