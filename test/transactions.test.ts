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

async function getTransactionId(cookies: string[]): Promise<string> {
  const listTransactionsResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies)
  const transactionId = listTransactionsResponse.body.transactions[0].id
  return transactionId
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

  it('should be able to list a single transaction by id', async () => {
    const cookies = await getCookiesFromCreatedTransaction()
    const transactionId = await getTransactionId(cookies)
    const response = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    const { status, body } = response

    expect(status).toBe(200)
    expect(body.transaction).toEqual(
      expect.objectContaining({
        id: transactionId,
        title: 'New transaction',
        amount: 100,
      }),
    )
  })

  it('should be able to list a summary of all transactions', async () => {
    const cookies = await getCookiesFromCreatedTransaction()

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'New debit transaction',
        amount: 25,
        type: 'debit',
      })

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    const { status, body } = response

    expect(status).toBe(200)
    expect(body).toEqual({
      amount: 75,
    })
  })
})
