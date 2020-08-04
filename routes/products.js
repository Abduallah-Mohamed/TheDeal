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
    getBestCeapestProducts
} = require('../middlewares/bestCeapestProducts');

router.route('/products').get(allProducts).post(addProduct);
router.route('/products/get-top-5').get(getBestCeapestProducts, allProducts);
router.route('/products/totalPrice').get(totalPrice);
router.route('/products/:id').delete(deleteProduct).get(getProduct);


module.exports = router;