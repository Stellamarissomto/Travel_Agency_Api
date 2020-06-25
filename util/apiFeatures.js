class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
      filter() {
  
        // FILTER
  
        const queryObj = {...this.queryString};
        const exclude = ['page', 'sort', 'limit', 'fields'];
  
        exclude.forEach(el => delete queryObj[el]);
  
        // ADVANCED FILTER
  
        let queryStr = JSON.stringify(queryObj);
  
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,  match => `$${match}`); // regex to add gt-greater than functionalities
       
        this.query.find(JSON.parse(queryStr));
  
        return this;
       // let query =  Tour.find(JSON.parse(queryStr));
  
  
      };
  
      sort() {
        // sorting
        if (this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        } else {
          this.query = query.sort('-createdAt'); // sort so that the newest created ones comes first
        }
  
        return this;
  
      };
    limitField () {
      // fields limiting 
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v'); // exclude __v
      }
  
      return this;
  
    };
  
    pagination () {
      
        // PAGINATION
  
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
  
       this.query = this.query.skip(skip).limit(limit);
  
       return this;
  
    };
  
  }

  module.exports = ApiFeatures;