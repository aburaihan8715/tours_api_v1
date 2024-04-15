import { jwtCookieExpiresIn } from '../libs/secret.js';

export const setCookie = (res, token) => {
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && true,
  });
};
