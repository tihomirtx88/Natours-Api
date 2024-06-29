class APIFeatures {
  constructor(query, reqQueryString) {
    this.query = query;
    this.reqQueryString = reqQueryString;
  }

  filter() {
    //1.Filtering
    const queryObj = { ...this.reqQueryString };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];
    exludedFields.forEach(el => delete queryObj[el]);

    //2.Advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sorting() {
    if (this.reqQueryString.sort) {
      const sortBy = this.reqQueryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.reqQueryString.fields) {
      const fields = this.reqQueryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exloding  __v property
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    const page = this.reqQueryString.page * 1 || 1;
    const limit = this.reqQueryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //page=2&limit=10 1-10 -page one 11 -20 page 20
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
