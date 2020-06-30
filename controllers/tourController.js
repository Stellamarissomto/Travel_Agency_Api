const Tour = require("../model/tour");
const ApiFeatures = require("../util/apiFeatures");


// @desc create a tour
exports.creatTour = async(req, res) => {
    try {

       const newTour = await Tour.create(req.body);
        res
        .status(201)
        .json({ status: 'success', data: newTour});
        
    } catch (err) {
        res.status(400).json({ error: err.message});
        
    }
};

// @desc retrive the best and cheapest top 5 tours

exports.top5 = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,duration,difficulty,price,ratingsAverage,summary,description';
  next()
};


// @desc retrieve all tours
exports.getTours = async(req, res) => {
  try {

    // Execute query
    const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();

      const tours = await features.query;
      res
      .status(200)
      .json({ status: 'success', result: tours.length, data: tours});

      
  } catch (err) {
      res.status(400).json({ error: err.message});
  }
};



//@ desc retrive a tour
exports.getTour = async(req, res) =>{
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200)
        .json({ status: 'success', data: tour});
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
};

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
        Error: err
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
      Error: err.message
    });
    
  }

};

exports.getStat = async( req, res) => {
  try {
    
    const stats = await Tour.aggregate( [
      {
        $match: { ratingsAverage: { $gt: 4.4}},
      },

      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1},
          totalPrice: { $sum: '$price'},
          avgRating: { $avg: '$ratingsAverage'},
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'}
        },
       
      },
      {
        $sort: { avgRating: -1 }
      }
    ]);

    //send response 
    res.status(200).json({
      status: 'success',
      data: stats
    });


  } catch (err) {
    res.status(404).json({
      status: 'fail',
      Error: err.message
    });
    
  }

};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDate'
      },
      {
        $match: {
          startDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(` ${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDate'},
          numTourStart: { $sum: 1},
          tours: { $push: '$name'}
    
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {
          numTourStart: -1
        }
      }
      
    ]);

  // send response
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      Error: err.message
    });
  }
};