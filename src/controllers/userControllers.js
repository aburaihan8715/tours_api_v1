import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { filterObj } from '../utils/filterObj.js';

// GET ALL USERS
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(500).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// CREATE A USER
const createAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

// GET A USER
const getAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

// UPDATE A USER
const updateAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

// DELETE A USER
const deleteAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

// UPDATE ME
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

// DELETE ME
const deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

export {
  getAllUsers,
  createAUser,
  getAUser,
  updateAUser,
  deleteAUser,
  updateMe,
  deleteMe,
};
