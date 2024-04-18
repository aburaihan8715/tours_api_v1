import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { filterObj } from '../utils/filterObj.js';
import * as factory from './factoryHandlers.js';

const getAllUsers = factory.getAll(User);
const getAUser = factory.getOne(User);

// Do not update password in this route
const updateAUser = factory.updateOne(User);
const deleteAUser = factory.deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        400,
        'This route is not for password updates. Please use /updateMyPassword.',
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
const deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

export { getAllUsers, getAUser, updateAUser, deleteAUser, updateMe, deleteMe };
