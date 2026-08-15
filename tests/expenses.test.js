import request from 'supertest';
import app from '../src/server.js';
import knex from '../src/db/knex.js';
import { Model } from 'objection';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  Model.knex(knex);
  // run migrations
  const migrate = await import('knex');
  // knex migrations via our knex instance
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.destroy();
});

function testUserHeader(userId, orgId) {
  return { 'x-test-user': JSON.stringify({ userId, orgId }) };
}

test('create expense returns 201 and stored expense', async () => {
  const headers = testUserHeader('user1', 'orgA');
  const res = await request(app)
    .post('/expenses')
    .set(headers)
    .send({ projectId: 1, payerId: 'user1', amount: 100.0, participants: [{ userId: 'user1' }, { userId: 'user2' }] });
  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty('id');
});

test('equal split: balances for one expense', async () => {
  const headers = testUserHeader('payerA', 'orgA');
  await request(app).post('/expenses').set(headers).send({ projectId: 10, payerId: 'payerA', amount: 90, participants: [{ userId: 'payerA' }, { userId: 'u2' }, { userId: 'u3' }], orgId: 'orgA' });

  const res = await request(app).get('/balances/10').set(headers);
  expect(res.statusCode).toBe(200);
  expect(res.body['payerA']).toBeCloseTo(60);
  expect(res.body['u2']).toBeCloseTo(-30);
  expect(res.body['u3']).toBeCloseTo(-30);
});

test('multiple expenses aggregate correctly', async () => {
  const headers = testUserHeader('p1', 'orgB');
  await request(app).post('/expenses').set(headers).send({ projectId: 20, payerId: 'p1', amount: 100, participants: [{ userId: 'p1' }, { userId: 'a' }, { userId: 'b' }], orgId: 'orgB' });
  await request(app).post('/expenses').set(headers).send({ projectId: 20, payerId: 'a', amount: 60, participants: [{ userId: 'a' }, { userId: 'b' }], orgId: 'orgB' });

  const res = await request(app).get('/balances/20').set(headers);
  expect(res.statusCode).toBe(200);
  expect(res.body['p1']).toBeGreaterThan(0);
  expect(res.body['a']).toBeDefined();
});

test('validation: creating expense without participants returns 400', async () => {
  const headers = testUserHeader('user1', 'orgA');
  const res = await request(app).post('/expenses').set(headers).send({ projectId: 30, payerId: 'user1', amount: 10 });
  expect(res.statusCode).toBe(400);
});

test('tenant isolation: user from other org cannot view balances', async () => {
  const headersA = testUserHeader('u1', 'orgA');
  await request(app).post('/expenses').set(headersA).send({ projectId: 99, payerId: 'u1', amount: 50, participants: [{ userId: 'u1' }, { userId: 'u2' }], orgId: 'orgA' });
  const headersB = testUserHeader('attacker', 'orgB');
  const res = await request(app).get('/balances/99').set(headersB);
  expect(res.statusCode).toBe(404);
});

test('immutability: patching expense returns 405', async () => {
  const headers = testUserHeader('user1', 'orgA');
  const create = await request(app).post('/expenses').set(headers).send({ projectId: 55, payerId: 'user1', amount: 40, participants: [{ userId: 'user1' }, { userId: 'user2' }], orgId: 'orgA' });
  const id = create.body.id;
  const res = await request(app).patch(`/expenses/${id}`).set(headers).send({ amount: 10 });
  expect(res.statusCode).toBe(405);
});
