import 'dotenv/config';

const serverPort = process.env.SERVER_PORT;
const mongoAtlasUri = process.env.MONGO_ATLAS_URI;
const jwtSecret = process.env.JWT_SECRET;

const smtpPass = process.env.SMTP_PASS;
const smtpUser = process.env.SMTP_USER;

const jwtCookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

export {
  serverPort,
  mongoAtlasUri,
  jwtSecret,
  smtpPass,
  smtpUser,
  jwtCookieExpiresIn,
  jwtExpiresIn,
};
