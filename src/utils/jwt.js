import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '1h' });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
