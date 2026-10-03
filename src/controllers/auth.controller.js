import { register } from '../services/auth.service.js';

export async function registerController(req, res, next) {
  try {
    const user = await register(req.body);
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}
