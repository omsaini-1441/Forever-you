import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// App Config
const app = express()
const port = process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(cors())