import { execSync } from 'node:child_process'
import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

async function getCookiesFromCreatedTransaction(): Promise<string[]> {
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 100,
      type: 'credit',
    })
  const cookies = createTransactionResponse.headers['set-cookie']
  return cookies
}

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 100,
      type: 'credit',
    })

    const { status } = response

    expect(status).toBe(201)
  })

  it('should set a sessionId cookie on create transaction if sessionId is not provided', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 100,
      type: 'credit',
    })

    const { status, headers } = response

    expect(status).toBe(201)
    expect(headers['set-cookie']).toBeDefined()
  })

  it('should not be able to list all transactions if sessionId is not provided', async () => {
    const response = await request(app.server).get('/transactions')

    const { status, body, headers } = response

    expect(status).toBe(401)
    expect(body).toEqual({
      error: 'Unauthorized',
    })
    expect(headers['set-cookie']).not.toBeDefined()
  })

  it('should be able to list all transactions', async () => {
    const cookies = await getCookiesFromCreatedTransaction()
    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const { status, body } = response

    expect(status).toBe(200)
    expect(body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 100,
      }),
    ])
  })
})
