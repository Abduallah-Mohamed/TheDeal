exports.getBestCheapestProducts = (req, res, next) => {
    req.query.fields = 'name,price,description,createDate';
    req.query.sort = 'price';
    req.query.limit = 5;
    next();
}