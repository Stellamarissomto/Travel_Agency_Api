const Tour = require("../model/tour");
const ApiFeatures = require("../util/apiFeatures");
const catchAsync = require("../middleware/catchAsync");
const AppError = require("../util/appError");

// @desc create a tour
exports.creatTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({ status: "success", data: newTour });
});

// @desc retrive the best and cheapest top 5 tours

exports.top5 = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields =
    "name,duration,difficulty,price,ratingsAverage,summary,description";
  next();
};

// @desc retrieve all tours
exports.getTours = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();

  const tours = await features.query;
  res
    .status(200)
    .json({ status: "success", result: tours.length, data: tours });
});

//@ desc retrive a tour
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// @desc update tour by id
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: tour,
  });
});

// @desc delete a tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const deltour = await Tour.findByIdAndDelete(req.params.id);

  if (!deltour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({ status: "success", message: "Deleted Tour" });
});

exports.getStat = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gt: 4.4 } },
    },

    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        totalPrice: { $sum: "$price" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: -1 },
    },
  ]);

  //send response
  res.status(200).json({
    status: "success",
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDate",
    },
    {
      $match: {
        startDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(` ${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDate" },
        numTourStart: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStart: -1,
      },
    },
  ]);

  // send response
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
