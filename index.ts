#! /usr/bin/env ts-node

import { exec } from 'child_process'
import express from 'express'
import fs from 'fs'
import https from 'https'

const app = express()
const key = fs.readFileSync('key.pem', 'utf8')
const cert = fs.readFileSync('cert.pem', 'utf8')
const ca = fs.readFileSync('chain.pem', 'utf8')

const [,, port = 3000, dest = 'https://dev-stage.mercateo.lan/incoming/adyen/urlnotify/gb/'] = process.argv
const DIFF = process.env.OUTPUT === 'diff'

app.use(express.json())
app.post('/', (req, res) => {
  log('in', JSON.stringify(req.body, null, 2), DIFF ? '+' : G)

  const curl = `curl \\
    --location '${dest}' \\
    --header 'Content-Type: application/json;charset=utf-8' \\
    --ciphers DEFAULT@SECLEVEL=1 \\
    --data '${JSON.stringify(req.body)}'`

  exec(curl, (error, stdout, stderr) => {
    if (error) {
      log('error', JSON.stringify(JSON.parse(stdout), null, 2), DIFF ? '!' : R)
      return res.status(500).json({ error: error.message })
    }

    log('out', JSON.stringify(JSON.parse(stdout), null, 2), DIFF ? '-' : Y)
    res.json(JSON.parse(stdout))
  })
})

const srv = https.createServer({ key, cert, ca }, app)
srv.listen(port, () => {
  log('listen', `Proxy listening on https://localhost:${port}`, DIFF ? '@' : B)
  log('info', `Forwarding to ${dest}`, DIFF ? ' ' : B)
})

const [BLANKLINE, R, G, B, Y] = [Symbol('BLANK'), 31, 32, 34, 33] as const

function log(kind: string, message?: string | object | typeof BLANKLINE, colour: 31 | 32 | 33 | 34 | ' ' | '@' | '#' | '+' | '-' | '!' = 34): void {
  const messages = typeof message === 'undefined' || Object.keys(message).length === 0
    ? [message === BLANKLINE ? '' : `\x1b[${30}m<empty>\x1b[0m`]
    : typeof message === 'string' ? message.split('\n') : Object.entries(message).map(([k, v]) => `${k}: ${v}`)

  if (typeof colour === 'number') {
    messages.forEach(m => console.log(`\x1b[${colour}m%s\x1b[0m %s`, `[${kind}]`.toLowerCase().padStart(9), truncate(m, 90)))
  } else {
    messages
      .map(m => colour === '@' ? `${truncate(m, 86).padEnd(86)}@@` : truncate(m, 88))
      .forEach(m => console.log(`%s%s %s`, colour === '@' ? '@@' : `${colour} `, `[${kind}]`.toLowerCase().padStart(9), m))
  }
}

function truncate(str: string, n: number): string {
  return str.length > n ? str.substring(0, n - 1) + '…' : str
}
