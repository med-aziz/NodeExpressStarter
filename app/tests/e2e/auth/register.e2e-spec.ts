import testDataSource from '../test.db.connection';
import testserver from '../test.server';
import * as request from 'supertest';


beforeAll(async () => {
  await testDataSource.initialize()
})
afterAll(async () => {
  await testDataSource.destroy()
})
describe('POST /v1/auth/register', () => {
  it('should return 422 when missing fields', async () => {
    const res = await request(testserver).post('/v1/auth/register');
    expect(res.statusCode).toBe(422);
  });
  it('should return 422 when email is not valid', async () => {
    const res = await request(testserver).post('/v1/auth/register').send({
      email: 'testemail',
      firstName: "testfirstname",
      lastName: "testlastname",
      password: 'testpassword123@',
    });
    expect(res.statusCode).toBe(422);
  });
  it('should return 422 when email is not valid', async () => {
    const res = await request(testserver).post('/v1/auth/register').send({
      email: 'testemail1@gmail',
      firstName: "testfirstname",
      lastName: "testlastname",
      password: 'testpassword123@A',
    });
    expect(res.statusCode).toBe(422);
  });
  it('should return 201 when everything is valid', async () => {
    const res = await request(testserver).post('/v1/auth/register').send({
      email: 'testemail@gmail.com',
      firstName: "testfirstname",
      lastName: "testlastname",
      password: 'testpassword123@A',
    });
    expect(res.statusCode).toBe(201);
  });
  it('should return 400 when email is already used', async () => {
    const res = await request(testserver).post('/v1/auth/register').send({
      email: 'testemail@gmail.com',
      firstName: "testfirstname",
      lastName: "testlastname",
      password: 'testpassword123@A',
    });
    expect(res.statusCode).toBe(400);
  });
});
