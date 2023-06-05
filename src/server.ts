import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'

const PORT = env.PORT

const app = fastify()
app.register(transactionRoutes, { prefix: '/transactions' })
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
