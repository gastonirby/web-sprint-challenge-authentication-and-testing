const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll( async () => {
  await db.destroy()
})

describe('POST /register', () => {

  test('Returns the correct user and status', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'child', password: 'little' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({username: 'child'})
  })

  test('Returns correct error and status when username already exists', async () => {
    const res = await request(server)
    .post('/api/auth/register')
    .send({ username: 'child', password: 'little' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("username taken")
  })
})

describe('POST /login', () => {
  
  test('User can successfully log in', async() => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'child', password: 'little' })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({message:"welcome, child"})
  })

  test("returns error if credentials don't match", async ()=> {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'chlid',password: 'little' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })
})

describe('GET /jokes', () => {
  
  test('path exists', async () => {
    const res = await request(server)
      .get('/api/jokes')

    expect(res).toBeTruthy()
  })

  test('returns error when no token', async () => {
    const res = await request(server)
      .get('/api/jokes')
    
    expect(res.status).toBe(401)
  })

})