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

async function createAuthUser(name, email, password) {
  const reg = await request(app).post('/api/v1/auth/register').send({ name, email, password });
  const login = await request(app).post('/api/v1/auth/login').send({ email, password });
  return { user: reg.body.user, token: login.body.token };
}

test('creates and lists tasks for authenticated user', async () => {
  const { token } = await createAuthUser('Alice', 'alice@example.com', 'password123');

  const createRes = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Build portfolio backend',
      description: 'Demonstrate clean architecture',
      status: 'in_progress',
      priority: 'high',
    });

  assert.equal(createRes.status, 201);
  assert.equal(createRes.body.task.title, 'Build portfolio backend');
  assert.equal(createRes.body.task.status, 'in_progress');

  const listRes = await request(app).get('/api/v1/tasks').set('Authorization', `Bearer ${token}`);

  assert.equal(listRes.status, 200);
  assert.equal(listRes.body.tasks.length, 1);
  assert.equal(listRes.body.tasks[0].id, createRes.body.task.id);
});

test('gets, updates, and deletes task by owner', async () => {
  const { token } = await createAuthUser('Bob', 'bob@example.com', 'password123');

  const createRes = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Initial task', priority: 'low' });

  const taskId = createRes.body.task.id;

  const getRes = await request(app)
    .get(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.task.id, taskId);

  const updateRes = await request(app)
    .patch(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'done', priority: 'high' });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.task.status, 'done');
  assert.equal(updateRes.body.task.priority, 'high');

  const deleteRes = await request(app)
    .delete(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(deleteRes.status, 204);

  const getDeletedRes = await request(app)
    .get(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(getDeletedRes.status, 404);
});

test('enforces strict tenant/owner isolation (prevents IDOR)', async () => {
  const user1 = await createAuthUser('User One', 'user1@example.com', 'password123');
  const user2 = await createAuthUser('User Two', 'user2@example.com', 'password123');

  const createRes = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${user1.token}`)
    .send({ title: 'Private task user 1' });

  const taskId = createRes.body.task.id;

  // User 2 cannot get User 1 task
  const getRes = await request(app)
    .get(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${user2.token}`);
  assert.equal(getRes.status, 404);

  // User 2 cannot update User 1 task
  const updateRes = await request(app)
    .patch(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${user2.token}`)
    .send({ title: 'Hacked title' });
  assert.equal(updateRes.status, 404);

  // User 2 cannot delete User 1 task
  const deleteRes = await request(app)
    .delete(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${user2.token}`);
  assert.equal(deleteRes.status, 404);

  // Task still intact for User 1
  const checkRes = await request(app)
    .get(`/api/v1/tasks/${taskId}`)
    .set('Authorization', `Bearer ${user1.token}`);
  assert.equal(checkRes.status, 200);
  assert.equal(checkRes.body.task.title, 'Private task user 1');
});
