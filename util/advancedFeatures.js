const Response = require("../models/responseModel");
const User = require("../models/userModel");

class AdvancedFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {

    const queryObj = {...this.queryString};
    const excludeQuery = ['sort', 'page', 'limit', 'field', 'vac', 'usr'];
    
    excludeQuery.forEach(el => delete queryObj[el]);
    
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);
    
    for(let el in queryStr) {
      if(el === 'position' || el === 'type' || el === 'city')
        queryStr[el] = new RegExp(queryStr[el], 'i');
    }


    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    // else {
    //   this.query = this.query.sort('-postedOn');
    // }
    return this;
  }

  limitingFields() {
    if(this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // console.log(fields);
      this.query = this.query.select('-email');
    } 
    else {
      this.query = this.query.select('-__v'); 
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10000;
    const skip = limit * (page - 1);

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = AdvancedFeatures;