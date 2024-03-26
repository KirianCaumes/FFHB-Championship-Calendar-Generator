import { readFile } from 'fs/promises'
import getIcs from '../utils/get-ics.util.js'

/**
 * @param {import('express').Request<{}, any, any, QueryType, Record<string, any>>} req Request
 * @param {import('express').Response<any, Record<string, any>, number>} res Result
 * @returns {Promise<any>} Returns
 */
export default async function index(req, res) {
    const { url, title } = req.query

    if (!url) {
        const indexPage = await readFile('./src/templates/index.template.html', 'utf-8')
        return res.send(indexPage)
    }

    try {
        /** ICS file found */
        const ics = await getIcs({ url, title })

        res.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': 'attachment; filename="calendar.ics"',
        })

        return res.end(ics)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        return res.status(400).send(`
            <p>Une erreur est survenue : <i>${error.message}</i></p>
            <p>Veuillez vérifier que le lien fourni respecte bien <a href="/" target="_blank">les conditions</a> :
            <a href={${url}} target="_blank">${url}</a>.</p>
            <p>Vous pouvez également contacter un administrateur du site.</p>
        `)
    }
}
