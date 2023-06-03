import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'
import { env } from './env'

const PORT = env.PORT

const app = fastify()

app.get('/', async (req, res) => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transaction test',
      amount: 100,
    })
    .returning('*')

  return transaction
})

app.get('/transactions', async (req, res) => {
  const transactions = await knex('transactions').select('*')

  return transactions
})

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server listening on port ${PORT}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
