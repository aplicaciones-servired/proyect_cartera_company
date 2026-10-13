import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { BasesRouter, CarteraRouter, SellersRouter, recaudoRouter } from './routes'
import { routerResumen } from './routes/resumen.routes'
import { CARTERA_FRONTEND, PORT, VERSION } from './config'

const app = express()

app.disable('x-powered-by')
  .use(express.json())
  .use(morgan('dev'))
  .use(express.urlencoded({ extended: true }))
  .use(cors({
    origin: CARTERA_FRONTEND,
    credentials: true,
  }))

app.use(VERSION, CarteraRouter)
  .use(VERSION, BasesRouter)
  .use(VERSION, SellersRouter)
  .use(VERSION, routerResumen)
  .use(VERSION, recaudoRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http:localhost:${PORT}`)
})

