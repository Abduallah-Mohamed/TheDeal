class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }

    filter() {
        /**
         * make a copy of req.query and search with new var because we want to delete the (sort, limit, page, fields)
         * form the query
         */

        // BUILD A QUERY 
        const queryObj = {
            ...this.queryString
        }

        // Excluded Fields
        const excludedFields = ['sort', 'limit', 'page', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // console.log(queryObj, req.query);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/, match => {
            return `$${match}`
        });

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {

        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createDate');
        }

        return this;
    }

    fields() {
        if (this.queryString.fields) {
            const theFields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(theFields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        // PAGINATION
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;