import express from 'express'
import https from 'https'
import cors from 'cors'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

import root from './routes/default.js'

const runPort = process.env.PORT || 3000

var app = express()
app.set('trust proxy', true)
// app.use(cors())
// app.use(
//     cors({
//         origin: ['https://bms-test.leishan.app.local', 'http://localhost:8887'],
//         methods: 'POST, GET, PUT, OPTIONS, DELETE',
//     })
// )

app.use(express.json())

app.use('/', root)

// var ssl = {
//     key: fs.readFileSync(process.env.CERT_KEY_PATH),
//     cert: fs.readFileSync(process.env.CERT_PEM_PATH),
// }

// var server = https.createServer(ssl, app)

// server.listen(runPort, function () {
//     console.log('runing Web Server in ' + runPort + ' port...')
// })

app.listen(runPort, () => {
    console.log(`Listening to Port ${runPort}..`)
})
