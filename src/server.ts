import fastify from 'fastify'
import { knex } from './database'

const PORT = 3333

const app = fastify()

app.get('/', async (req, res) => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
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
