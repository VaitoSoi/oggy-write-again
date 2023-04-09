import dotenv from 'dotenv'
dotenv.config('./.env')
import { Client, ENV } from './src/index.js'
const env = new ENV(process.env)
const client = new Client(env)
client.start()