#! /usr/bin/env ts-node

import bodyParser from 'body-parser'
import { exec } from 'child_process'
import express from 'express'
import fs from 'fs'
import https from 'https'

const app = express()
const key = fs.readFileSync('key.pem', 'utf8')
const cert = fs.readFileSync('cert.pem', 'utf8')
const ca = fs.readFileSync('chain.pem', 'utf8')

const [,, port = 3000, dest = 'https://dev-stage.mercateo.lan/incoming/adyen/urlnotify/gb'] = process.argv

app.use(bodyParser.json())

app.post('/', (req, res) => {
  log('in', JSON.stringify(req.body, null, 2), 33)

  const curl = `curl \\
    --location '${dest}' \\
    --header 'Content-Type: application/json;charset=utf-8' \\
    --ciphers DEFAULT@SECLEVEL=1 \\
    --data '${JSON.stringify(req.body)}'`

  exec(curl, (error, stdout, stderr) => {
    if (error) {
      log('out', JSON.stringify(JSON.parse(stdout), null, 2), 31)
      return res.status(500).json({ error: error.message })
    }

    log('out', JSON.stringify(JSON.parse(stdout), null, 2), 32)
    res.json(JSON.parse(stdout))
  })
})

const srv = https.createServer({ key, cert, ca }, app)
srv.listen(port, () => {
  log('listen', `Proxy listening on https://localhost:${port}`)
  log('info', `Forwarding to ${dest}`, 33)
})

const BLANKLINE = Symbol('BLANK')

function log(kind: string, message?: string | object | typeof BLANKLINE, color: 31 | 32 | 33 | 34 = 34): void {
  (typeof message === 'undefined' || Object.keys(message).length === 0
    ? [message === BLANKLINE ? '' : `\x1b[${30}m<empty>\x1b[0m`]
    : typeof message === 'string' ? message.split('\n') : Object.entries(message).map(([k, v]) => `${k}: ${v}`)
  ).forEach(m => console.log(`\x1b[${color}m%s\x1b[0m`, `[${kind}]`.toLowerCase().padStart(9), truncate(m, 90)))
}

function truncate(str: string, n: number): string {
  return str.length > n ? str.substring(0, n - 1) + '…' : str
}
