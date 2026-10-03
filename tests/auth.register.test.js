import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

test.beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

test.after(async () => {
  await prisma.$disconnect();
});

test('registers a user, normalizes email, and hashes the password', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Ada Lovelace', email: ' ADA@EXAMPLE.COM ', password: 'password123' });

  assert.equal(response.status, 201);
  assert.equal(response.body.user.email, 'ada@example.com');
  assert.equal('passwordHash' in response.body.user, false);

  const user = await prisma.user.findUnique({ where: { email: 'ada@example.com' } });
  assert.ok(user);
  assert.notEqual(user.passwordHash, 'password123');
  assert.equal(await bcrypt.compare('password123', user.passwordHash), true);
});

test('rejects invalid registration data', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: '', email: 'invalid', password: 'short' });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Validation failed');
  assert.ok(Array.isArray(response.body.details));
});

test('rejects a duplicate email', async () => {
  const payload = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' };

  await request(app).post('/api/v1/auth/register').send(payload);
  const response = await request(app).post('/api/v1/auth/register').send(payload);

  assert.equal(response.status, 409);
  assert.deepEqual(response.body, { error: 'Email is already registered' });
});
