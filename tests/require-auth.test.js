import assert from 'node:assert/strict';
import test from 'node:test';
import { requireAuth } from '../src/middlewares/require-auth.js';

test('requireAuth rejects a missing bearer token', () => {
  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  requireAuth({ get: () => undefined }, response, () => {
    throw new Error('next should not be called');
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: 'Unauthorized' });
});

test('requireAuth passes a bearer token through', () => {
  const request = { get: () => 'Bearer example-token' };
  let called = false;

  requireAuth(request, {}, () => {
    called = true;
  });

  assert.equal(called, true);
  assert.equal(request.authToken, 'example-token');
});
