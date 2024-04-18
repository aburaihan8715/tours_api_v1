import { APIFeatures } from '../utils/apiFeatures.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(404, 'No document found with this ID'));
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
};

const updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(404, 'No document found with this ID'));
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

const createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

const getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(404, 'No document found with this ID'));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });
};

const getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour(hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .search('name', 'role') // we can add any field
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
};

export { deleteOne, updateOne, getOne, getAll, createOne };
