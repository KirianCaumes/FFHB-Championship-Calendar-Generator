import express from 'express'
import path from 'path'
import getIcs from './utils/getIcs.util'

const app = express()

app.use('/bulma', express.static(`${path.resolve()}/node_modules/bulma/css`))

app.all('*', getIcs)

app.listen(
    process.env.PORT || 3000,
    // eslint-disable-next-line no-console
    () => console.log('FFHB Championship Calendar started on'),
)
