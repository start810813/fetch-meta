import express from 'express'
import Page from '../controllers/page.js'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.send('Hi')
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