import _package from './package.json'  assert { type: "json" };
console.log(
    `\n\n` +
    ` -----     OggyTheCode     ----\n` +
    `> Create by: ${_package.author}\n` +
    `> Version: ${_package.version}\n` +
    `> License: ${_package.license}\n\n`
)

import dotenv from 'dotenv'
dotenv.config({ path: './config.env' })
import { Client, ENV } from './src/index.js'
const env = new ENV(process.env)
const client = new Client(env)
client.start()