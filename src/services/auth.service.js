import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../repositories/user.repository.js';

export async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error('Email is already registered');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email: normalizedEmail, passwordHash });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
