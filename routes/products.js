const express = require('express');
const router = express.Router();

const {
    allProducts,
    addProduct,
    deleteProduct,
    totalPrice,
    getProduct
} = require('../controllers/products');

const {
    getBestCheapestProducts
} = require('../middlewares/bestCheapestProducts');
const {
    protect,
    restrictTo
} = require('../controllers/auth');

router.route('/products').get(protect, allProducts).post(protect, addProduct);
router.route('/products/get-top-5').get(getBestCheapestProducts, allProducts);
router.route('/products/totalPrice').get(totalPrice);
router.route('/products/:id').delete(protect, restrictTo('admin', 'product owner'), deleteProduct).get(getProduct);


module.exports = router;