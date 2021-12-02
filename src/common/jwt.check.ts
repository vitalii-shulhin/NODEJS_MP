import expressJwt from 'express-jwt';
import dotenv from 'dotenv';
dotenv.config();

export const isJwtValid = expressJwt({
  secret: process.env.SECRET_TOKEN || 'SECRET_TOKEN',
  algorithms: ['HS256'],
}).unless({ path: ['/login'] });
