import { User } from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';

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

export { getAllUsers, createAUser, getAUser, updateAUser, deleteAUser };
