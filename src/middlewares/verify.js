import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { jwtSecretForLogin } from '../libs/secret.js';

const verifyAuthentication = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError(401, 'You are not logged in! Please log in to get access'),
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, jwtSecretForLogin);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        401,
        'The user belonging to this token does no longer exist',
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.isPasswordChangedAfter(decoded.iat)) {
    return next(
      new AppError(401, 'User recently changed password! Please login again.'),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

const verifyAuthorization = (...roles) => {
  return (req, res, next) => {
    // roles ['admin','lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'You do not have permission to preform this action'),
      );
    }
    next();
  };
};

export { verifyAuthentication, verifyAuthorization };
