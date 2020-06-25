const Tour = require("../model/tour");



// desc create a tour
exports.creatTour = async(req, res) => {
    try {

       const newTour = await Tour.create(req.body);
        res
        .status(201)
        .json({ status: 'success', data: newTour});
        
    } catch (err) {
        res.status(400).json({ error: err.message});
        
    }
}

// desc retrieve all tours
exports.getTours = async(req, res) => {
    try {
// FILTER

      const queryObj = {...req.query};
      const exclude = ['page', 'sort', 'limit', 'fields'];

      exclude.forEach(el => delete queryObj[el]);

    


      // ADVANCED FILTER

      let queryStr = JSON.stringify(queryObj);

      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,  match => `$${match}`); // regex to add gt-greater than functionalities
     
      let query =  Tour.find(JSON.parse(queryStr));

      // sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt'); // sort so that the newest created ones comes first
      }

      // fields limiting 
      if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v'); // exclude __v
      }





        const tours = await query;
        res
        .status(200)
        .json({ status: 'success', result: tours.length, data: tours});

        
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
}
//@ desc retrive a tour
exports.getTour = async(req, res) =>{
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200)
        .json({ status: 'success', data: tour});
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
}

// @desc update tour by id
exports.updateTour = async (req, res) => {
    try {
     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
       new: true,
       runValidators: true
     });
      res.status(200).json({
        status: 'success',
        data: tour
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };

  // @desc delete a tour
exports.deleteTour = async(req, res) => {
  try {
    const deltour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200)
    .json({ status: 'success', message: "Deleted Tour"});
  } catch (err) {

    res.status(404).json({
      status: 'fail',
      message: err
    });
    
  }

};