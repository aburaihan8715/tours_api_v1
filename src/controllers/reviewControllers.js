import { Review } from '../models/reviewModel.js';
import * as factory from './factoryHandlers.js';

const setTourAndUserIds = (req, res, next) => {
  // Allow nested routes
  // NOTE: verify important!!
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = factory.getAll(Review);
const createAReview = factory.createOne(Review);
const updateAReview = factory.updateOne(Review);
const deleteAReview = factory.deleteOne(Review);
const getAReview = factory.getOne(Review);

export {
  getAllReviews,
  createAReview,
  deleteAReview,
  updateAReview,
  setTourAndUserIds,
  getAReview,
};
