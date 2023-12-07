import path from 'path'
import express from 'express'
import getIcs from './utils/get-ics.util.js'

const app = express()

app.use('/bulma', express.static(`${path.resolve()}/node_modules/bulma/css`))
app.use(express.static('public'))

app.all('*', getIcs)

app.listen(
    process.env.PORT || 3000,
    // eslint-disable-next-line no-console
    () => console.log(`FFHB Championship Calendar Generator listening on ${process.env.PORT || 3000}`),
)
