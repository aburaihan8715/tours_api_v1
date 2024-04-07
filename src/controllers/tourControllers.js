import { Tour } from '../models/tourModel.js';
import { APIFeatures } from '../utils/apiFeatures.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

// GET TOP 5 TOURS
const aliasTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// GET ALL TOURS
const getAllTours = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Tour.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const tours = await apiFeatures.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

// CREATE A TOUR
const createATour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// GET A TOUR
const getATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour)
    return next(new AppError(404, 'No tour found with this ID'));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// UPDATE A TOUR
const updateATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour)
    return next(new AppError(404, 'No tour found with this ID'));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// DELETE A TOUR
const deleteATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour)
    return next(new AppError(404, 'No tour found with this ID'));

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// GET TOUR STATS
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

// GET MONTHLY PLAN
const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    // {
    //   $limit: 6,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

export {
  getAllTours,
  createATour,
  getATour,
  updateATour,
  deleteATour,
  aliasTours,
  getTourStats,
  getMonthlyPlan,
};
