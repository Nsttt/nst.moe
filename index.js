const express = require('express')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const yup = require('yup')
const monk = require('monk')
const nanoid = require('nanoid')
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')

require('dotenv').config();

const db = monk(process.env.MONGODB_URI)
const urls = db.get('urls')
urls.createIndex({alias: 1 }, { unique: true })

const app = express()
app.enable('trust proxy');

app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", "https://unpkg.com/"],
        imgSrc: ["'self'", "https://i.imgur.com/"]
    }
}))
app.use(morgan('common'))
app.use(express.json())
app.use(express.static('./public'))

const notFoundPath = path.join(__dirname, 'public/404.html');

app.get('/:id', async (req, res, next) => {
    const { id: alias } = req.params;
    try {
        const url = await urls.findOne({ alias })
        if (url) {
            res.redirect(url.url)
        }
        return res.status(404).sendFile(notFoundPath)
    } catch (error) {
        return res.status(404).sendFile(notFoundPath)
    }
})

const schema = yup.object().shape({
    alias: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
})

app.post('/url', slowDown({
    windowMs: 30 * 1000,
    delayAfter: 1,
    delayMs: 500,
}), async (req, res, next) => {
    let { alias, url } = req.body;
    try {
        await schema.validate({
            alias,
            url,
        })
        if (url.includes('nst.sh')) {
            throw new Error('STOP! YOU VIOLATED THE LAW! PAY THE COURT A FINE OR SERVE YOUR SENTENCE, YOUR STOLEN GOODS ARE NOW FORFEIT.');
          }
        if (!alias) {
            alias = nanoid(5);
        } else {
            const existing = await urls.findOne({ alias })
            if (existing) {
                throw new Error('Alias is in use.')
            }
        }
        alias = alias.toLowerCase();
        const newUrl = {
            url,
            alias,
        }
        const created = await urls.insert(newUrl)
        res.json(created)
    } catch (error) {
        next(error)
    }
})

app.use((req, res, next) => {
    res.status(404).sendFile(notFoundPath);
  });

app.use((req, res, error, next) => {
    if (error.status) {
        res.status(error.status)
    } else {
        res.status(500)
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'Error' : error.stack
    })
})

const port = process.env.PORT || 1330
app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})
