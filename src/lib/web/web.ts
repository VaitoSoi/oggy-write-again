import { randomUUID } from "crypto";
import { Oggy } from "../index.js";
import express, { Express } from 'express'
import { readFileSync } from "fs";
import dayjs from "dayjs";

export class OggyExpress {
    public app: Express = express()
    public token: string[] = [randomUUID()]

    constructor(private oggy: Oggy) {
        if (this.oggy.config.system.env == 'production') this.token.push('production_token')
        this.app.get('/', (req, res) => {
            res.send(`<!DOCTYPE html>
            <body>
                <p>To use this site, please head to <a href='/debug/'>Debug Page</a> to get Token.</p>
                <a href="/token">Print Token to console<br></a>
                <a href="/debug">Debug Log (query: &lt;token&gt;)<br></a>
                <a href="/events">Emit a Events (query: &lt;token&gt; &lt;eventName&gt; [eventArgs (separate by '_')])</a>
            </body>`) 
        })
        this.app.get('/token', (req, res) => { oggy.logger.info(`Web token: ${this.token}`); res.send('Logged') })
        this.app.get('/debug', (req, res) => {
            if (!req.query.token || !this.token.includes(<string>req.query.token)) res.status(401).send('Invalid token')
            else if (!oggy.config.system.path.debug) res.send(`No logger file`)
            else 
                res.send(readFileSync(oggy.config.system.path.debug, { encoding: 'utf-8' }).replace(/\n/gi, '<br>'))
        })
        this.app.get('/event', (req, res) => {
            if (!req.query.token || !this.token.includes(<string>req.query.token)) res.status(401).send('Invalid token')
            else if (!req.query.event) res.status(404).send('Invalid events')
            else {
                oggy.eventEmitter.emit(<string>req.query.event, ...(<string>req.query.args || '').split('_'))
                res.send(`<p>Emited event ${req.query.event} at ${dayjs().format('HH:mm:ss - DD/MM/YY')}.<br>Please check the log file at <a href='/debug&token=${req.query.token}'>debug file</a></p>`)
            }
        })
        this.app.get('/eval', (req, res) => res.send('Nah, HS will mad at me :v'))
    }

    listen(port: number = 8000) {
        this.app.listen(port);
        this.oggy.logger.info(`Web listend at port ${port}`)
    }
}