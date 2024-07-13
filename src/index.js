import path from 'path'
import express from 'express'
import index from './routes/index.route.js'

const app = express()

app.disable('x-powered-by')

app.use('/bulma', express.static(`${path.resolve()}/node_modules/bulma/css`))
app.use(express.static('public'))

app.all('*', index)

app.listen(
    process.env.PORT || 3000,
    // eslint-disable-next-line no-console
    () => console.log(`FFHB Championship Calendar Generator listening on ${process.env.PORT || 3000}`),
)
