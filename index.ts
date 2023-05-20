import _package from './package.json';
console.log(
    `\n\n` +
    ` -----     OggyTheCode     ----\n` +
    `> Create by: ${_package.author}\n` +
    `> Version: ${_package.version}\n` +
    `> License: ${_package.license}\n\n`
)

import { Oggy, ENV, YAML } from './src/index'
import { parse } from 'yaml'
import { readFileSync } from 'node:fs'
import dotenv from 'dotenv'
let config: ENV | YAML | any;
if (!process.argv[2] || process.argv[2] == 'env') {
    dotenv.config({ path: './config.env' })
    config = new ENV(process.env)
} else if (process.argv[2] == 'yaml') config = new YAML(parse(readFileSync('./config.yaml', { encoding: 'utf-8' })))
else throw new Error(`unknown cofig ${process.argv[2]}`)
// console.dir(config, { depth: null })
const client = new Oggy(config)
client.start()