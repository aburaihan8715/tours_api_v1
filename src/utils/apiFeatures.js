class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludeFields.forEach((item) => delete queryObj[item]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);
    this.query = this.query.find(queryStr);
    return this;
  }

  // 2) searching
  search(...searchFields) {
    if (this.queryString.search) {
      const search = this.queryString.search;
      const searchRegexp = new RegExp(`.*${search}.*`, 'i');

      const queryBySearch = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: searchRegexp },
        })),
      };
      this.query = this.query.find(queryBySearch);
    }
    return this;
  }

  // search() {
  //   if (this.queryString.search) {
  //     const search = this.queryString.search;
  //     const searchRegexp = new RegExp(`.*${search}.*`, 'i');

  //     const queryBySearch = {
  //       $or: [
  //         { name: { $regex: searchRegexp } },
  //         { difficulty: { $regex: searchRegexp } },
  //       ],
  //     };
  //     this.query = this.query.find(queryBySearch);
  //   }
  //   return this;
  // }

  // 3) sorting
  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortedBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // 4) Fields limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // NOTE: we receive count in client side from response results
  // 5) pagination
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { APIFeatures };
