import crypto from 'crypto';
import { jwtExpiresIn, jwtSecret } from '../libs/secret.js';
import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createJWT } from '../utils/createJWT.js';
import { sendEmail } from '../utils/email.js';
import { setCookie } from '../utils/setCookie.js';

// CREATE/SIGNUP A USER
const signup = catchAsync(async (req, res, next) => {
  // 01) receive the body data and check data exist
  // const { name, email, password, passwordConfirm } = req.body;

  // 02) check whether user exists based on body email
  const isUserExists = await User.findOne({ email: req.body.email });
  // NOTE: we can throw an error or call the next()
  // if (isUserExists) throw new AppError(409, 'User already exists');
  // OR
  if (isUserExists) return next(new AppError(409, 'User already exists'));

  // 03) create user
  const newUser = new User(req.body);
  await newUser.save();

  // 04) create token
  const token = createJWT({ id: newUser._id }, jwtSecret, jwtExpiresIn);

  // set cookie
  setCookie(res, token);

  // Remove password and __v from output
  newUser.password = undefined;
  newUser.__v = undefined;

  // 05) send response
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

// LOGIN
const login = catchAsync(async (req, res, next) => {
  // 01) receive the body data and check data exist
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(400, 'Please provide email and password'));

  // 02) check whether user exists based on body email
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError(401, 'Wrong credentials!'));

  // 03) check password is correct based find user
  const isPasswordCorrect = await user.isPasswordCorrect(
    password,
    user.password,
  );

  if (!isPasswordCorrect) return next(new AppError(401, 'Wrong credentials!'));

  // 04) create token
  const token = createJWT({ id: user._id }, jwtSecret, jwtExpiresIn);

  // set cookie
  setCookie(res, token);

  // 05) send response
  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

// FORGET PASSWORD
const forgetPassword = catchAsync(async (req, res, next) => {
  // 01) Get user based on body email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(404, `There is no user with this email`));

  // 02) Generate random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 03) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forget your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min).',
      message,
    });

    res.status(201).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        500,
        'There is an error sending the email. Try again later!',
      ),
    );
  }
});

// RESET PASSWORD
const resetPassword = catchAsync(async (req, res, next) => {
  // 01) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 02) If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError(400, 'Token is invalid or expired!'));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 03) Update changedPasswordAt property for the user

  // 04) create token
  const token = createJWT({ id: user._id }, jwtSecret, jwtExpiresIn);

  // set cookie
  setCookie(res, token);

  // 05) send response
  res.status(201).json({
    status: 'success',
    token,
  });
});

// UPDATE PASSWORD
const updatePassword = catchAsync(async (req, res, next) => {
  // 01) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 02) Check if input current password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(
    req.body.passwordCurrent,
    user.password,
  );

  if (!isPasswordCorrect) {
    return next(new AppError(401, 'Your current password is wrong.'));
  }

  // 03) if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 04) create token
  const token = createJWT({ id: user._id }, jwtSecret, jwtExpiresIn);

  // set cookie
  setCookie(res, token);

  // 05) send response
  res.status(201).json({
    status: 'success',
    token,
  });
});

export { signup, login, forgetPassword, resetPassword, updatePassword };
