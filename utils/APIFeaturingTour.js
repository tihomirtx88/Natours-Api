class APIFeatures {
  constructor(query, reqQueryString) {
    this.query = query;
    this.reqQueryString = reqQueryString;
  }

  //Example
  // new APIFeatures(Tour.find(), req.query)
  // .filter()
  // .sorting()
  // .limitFields()
  // .pagination();

  filter() {
    //1.Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    const filters = { ...this.queryString };
    // Clean system fields
    excludedFields.forEach(field => delete filters[field]);

    //2.Advanced filtering
    Object.keys(filters).forEach(key => {
      if (typeof filters[key] === 'object') {
        Object.keys(filters[key]).forEach(operator => {
          if (['gte', 'gt', 'lte', 'lt'].includes(operator)) {
            filters[key][`$${operator}`] = filters[key][operator];
            delete filters[key][operator];
          }
        });
      }
    });

    this.query = this.query.find(filters);
    return this;
  }

  sorting() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : '-createdAt';

    this.query = this.query.sort(sortBy);
    return this;
    // Transform to this .sort('price ratingsAverage')

    return this;
  }

  limitFields() {
    const fields = this.queryString.fields
      ? this.queryString.fields.split(',').join(' ')
      : '-__v';

    this.query = this.query.select(fields);
    return this;
    //Transform to .select('name price duration')
  }

  pagination() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(parseInt(this.queryString.limit, 10) || 100, 100);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
