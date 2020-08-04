// require mongoose
// console.log('heloooooooooooooooooooooooooooo')
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');
const fs = require('fs');

mongoose
    .connect('mongodb://localhost/thedeal', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        // console.log(con.Mongoose.connections[0].port);
        console.log('connected successfully to the database ...');
    });

const allProducts = JSON.parse(fs.readFileSync(`${__dirname}/MOCK_DATA.json`, 'utf-8'));
const allReviews = JSON.parse(fs.readFileSync(`${__dirname}/MOCK_REVIEW_DATA.json`, 'utf-8'));

// console.log(allProducts);
const createData = async() => {
    try {
        await Product.create(allProducts);
        await Review.create(allReviews);
        console.log('Data Successfully Created ... ');
    } catch (error) {
        console.log(error);
        console.error('There is an fucking during importing !!!');
    }
}

const deleteData = async() => {
    try {
        console.log('data is going to be deleted ... ');
        await Product.deleteMany();
        await Review.deleteMany();
        console.log('data Deleted ... ');
    } catch (error) {
        console.log(error);
        console.error('There is an fucking during Deleting !!!');
    }
}

if (process.argv[2] === '--import') {
    createData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}