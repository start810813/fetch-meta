import express from 'express'
import path from 'path'
import Page from '../controllers/page.js'

const router = express.Router()
const __dirname = path.resolve(path.dirname(''))

router.get('/', (req, res, next) => {
    res.send('Hi')
    next()
})

router.get('/line-liff-share', (req, res, next) => {
    res.render('liff', {
        title: 'Line Liff Share'
    })
    next()
})

router.get('/line-id', (req, res, next) => {
    res.json({
        lineLiffId: process.env.LINE_LIFF_ID
    })
    next()
})

router.post('/meta', async (req, res, next) => {
    try {
        const url = req.body?.url
        if (!url) res.status(404).send('Not Found')
        const page = new Page(url)
        const meta = await page.getMeta()
        res.send(meta)
    } catch (error) {
        res.status(400).send(error)
    }
    next()
})

export default router