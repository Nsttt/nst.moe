const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const yup = require('yup')
const monk = require('monk')
const nanoid = require('nanoid')

require('dotenv').config();

const db = monk(process.env.MONGODB_URI)
const urls = db.get('urls')
urls.createIndex({alias: 1 }, { unique: true })

const app = express()

app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('./public'))


app.get('/', (req, res) => {

})

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const url = await urls.findOne({ alias })
        if (url) {
            res.redirect(url.url)
        }
        res.redirect(`/?error=${alias} not found`)
    } catch (error) {
        res.redirect(`/?error=Link not found`)
    }
})

const schema = yup.object().shape({
    alias: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required(),
})

app.post('/url', async (req, res, next) => {
    let { alias, url } = req.body;
    try {
        await schema.validate({
            alias,
            url,
        })
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

app.use((error, req, res, next) => {
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
