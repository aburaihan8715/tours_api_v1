import { jwtSecretForLogin, jwtSecretForSignup } from '../libs/secret.js';
import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createJWT } from '../utils/createJWT.js';

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
  const signupToken = createJWT({ id: newUser._id }, jwtSecretForSignup, '10d');
  // console.log(signupToken);

  // 05) send response
  res.status(201).json({
    status: 'success',
    token: signupToken,
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
  const isPasswordCorrect = user.isPasswordCorrect(password, user.password);
  if (!isPasswordCorrect) return next(new AppError(401, 'Wrong credentials!'));

  // 04) create token
  const loginToken = createJWT({ id: user._id }, jwtSecretForLogin, '7d');

  // 05) send response
  res.status(201).json({
    status: 'success',
    token: loginToken,
    data: { user },
  });
});

export { signup, login };
