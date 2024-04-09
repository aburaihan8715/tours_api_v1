import 'dotenv/config';

const serverPort = process.env.SERVER_PORT;
const mongoAtlasUri = process.env.MONGO_ATLAS_URI;
const jwtSecretForSignup = process.env.JWT_SECRET_FOR_SIGNUP;
const jwtSecretForLogin = process.env.JWT_SECRET_FOR_LOGIN;

export { serverPort, mongoAtlasUri, jwtSecretForSignup, jwtSecretForLogin };
