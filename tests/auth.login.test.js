import assert from 'node:assert/strict';
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

test('logs in an existing user and returns token with user info', async () => {
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' });

  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'ADA@EXAMPLE.COM', password: 'password123' });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, 'ada@example.com');
  assert.equal('passwordHash' in response.body.user, false);
});

test('rejects login with wrong password', async () => {
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' });

  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'ada@example.com', password: 'wrongpassword' });

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Invalid email or password');
});

test('rejects login with unknown email', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'nonexistent@example.com', password: 'password123' });

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Invalid email or password');
});

test('rejects login with invalid payload', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'invalid-email', password: '' });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Validation failed');
});
