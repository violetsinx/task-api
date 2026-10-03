import { register, login } from '../services/auth.service.js';

export async function registerController(req, res, next) {
  try {
    const user = await register(req.body);
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const result = await login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
