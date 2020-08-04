// const AppError = require('');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/Product');
const createError = require('http-errors');
const APIFeatures = require('../utils/ApiFeatures');

exports.allProducts = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Product.find(), req.query).filter().sort().fields().paginate();
    const products = await features.query;

    if (!products) {
        return next(new createError(404, 'There is no products for you'));
    }

    res.status(200).json({
        success: true,
        count: products.length,
        data: {
            products,
        },
    });
});

// CREATE NEW PRODUCT
exports.addProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: {
            product,
        },
    });
});

// DELETE SINGLE PRODUCT USING ID
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(
            new createError(403, `this is product with id ${req.params.id} NOT exist`)
        );
    }

    res.status(204).json({
        success: 'Deleted',
    });
});

// GET SINGLE PRODUCT USING ID
exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("reviews");

    if (!product) {
        return next(
            new createError(404, `this is product with id ${req.params.id} NOT exist`)
        );
    }

    res.status(200).json({
        success: true,
        data: {
            product,
        },
    });
});

// get the Total price for specific product with similar name
exports.totalPrice = catchAsync(async (req, res, next) => {
    const products = await Product.aggregate([{
            $match: {
                name: "BMW"
            }
        },
        {
            $group: {
                _id: "$color",
                total: {
                    $sum: "$price"
                },
                minPrice: {
                    $min: "$price"
                },
                maxPrice: {
                    $max: "$price"
                },
                avgPrice: {
                    $avg: "$price"
                },
                numberOfCars: {
                    $sum: 1
                }
            }
        }
    ]);

    res.status(200).send(products);
});