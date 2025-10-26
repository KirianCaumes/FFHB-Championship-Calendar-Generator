import path from 'path'
import express from 'express'
import index from 'routes/index.route'

const app = express()

app.disable('x-powered-by')

app.use('/bulma', express.static(`${path.resolve()}/node_modules/bulma/css`))
app.use(express.static('public'))

app.use(index)

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const port = process.env.PORT || 3000

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`FFHB Championship Calendar Generator listening on ${port}`)
})
