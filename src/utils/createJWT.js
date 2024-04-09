import jwt from 'jsonwebtoken';
import { AppError } from './appError.js';

const createJWT = (payload, secretKey, expiresIn = '1h') => {
  try {
    if (!payload || typeof payload !== 'object')
      throw new AppError(406, 'Payload must be a non-empty object!');

    if (!secretKey || typeof secretKey !== 'string')
      throw new AppError(406, 'Secret key must be a non-empty string!');

    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error('Failed to sign jwt');
    throw error;
  }
};

export { createJWT };
