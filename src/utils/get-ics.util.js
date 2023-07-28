import ical from 'ical-generator'
import axios from 'axios'
import Handlebars from 'handlebars'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import getCfkKey from './get-cfk-key.util'
import decipher from './decipher.util'

/**
 * @param {import('express').Request<{}, any, any, QueryType, Record<string, any>>} req Request
 * @param {import('express').Response<any, Record<string, any>, number>} res Result
 * @returns {Promise<any>} Returns
 */
export default async function getIcs(req, res) {
    const { url, title } = req.query

    if (!url)
        return res.send(Handlebars.compile(fs.readFileSync('./src/templates/index.template.html').toString())())

    try {
        const equipeId = /\/equipe-([^)]+)\//gm.exec(url)[1]
        const urlCompetition = url.replace(/\/$/, '').split('/').at(-2)

        const { data: dataRencontreListData } = await axios.request({
            url: 'https://www.ffhandball.fr/wp-json/competitions/v1/computeBlockAttributes',
            method: 'GET',
            params: {
                block: 'competitions---rencontre-list',
                url_competition: urlCompetition,
                ext_equipe_id: equipeId,
            },
        })

        const cfkKey = await getCfkKey()

        const rencontreList = /** @type {FfhbApiCompetitionListResult} */(decipher(dataRencontreListData, cfkKey))

        /** Addresses (and more?) are scraped because they are no longer inside the API returns. And no others API seems to be available for these data */
        const details = await Promise.allSettled(
            rencontreList.rencontres.map(async rencontre => {
                const baseUrl = url.replace(/\/$/, '').split('/').slice(0, -1).join('/')
                const rencontreUrl = `${baseUrl}/poule-${rencontreList.poule.ext_pouleId}/rencontre-${rencontre.ext_rencontreId}`

                const { data: addressData } = await axios.request({ url: rencontreUrl })
                const { document } = (new JSDOM(addressData)).window

                /** @type {FfhbApiAddressResult} */
                const address = JSON.parse(document.querySelector('smartfire-component[name="competitions---rencontre-salle"]').getAttribute('attributes'))

                return { address }
            }),
        )

        const events = rencontreList.rencontres
            .map((rencontre, i) => {
                if (!rencontre.date)
                    return null

                const dtStart = new Date(rencontre.date)
                const dtEnd = new Date(dtStart.getTime() + (1.5 * 60 * 60 * 1000))

                const status = (() => {
                    if (!rencontre.equipe1Score || !rencontre.equipe2Score)
                        return ''
                    const isTeamOne = rencontre.equipe1Libelle?.toLowerCase()?.trim() === rencontreList.poule.libelle?.toLowerCase()?.trim()
                    const teamOneScore = !Number.isNaN(parseInt(rencontre.equipe1Score, 10)) ? (parseInt(rencontre.equipe1Score, 10)) : 0
                    const teamTwoScore = !Number.isNaN(parseInt(rencontre.equipe2Score, 10)) ? (parseInt(rencontre.equipe2Score, 10)) : 0
                    if (isTeamOne ? teamOneScore > teamTwoScore : teamOneScore < teamTwoScore)
                        return '✅'
                    if (!isTeamOne ? teamOneScore > teamTwoScore : teamOneScore < teamTwoScore)
                        return '❌'
                    return '🟠'
                })()

                const fileCode = rencontre.fdmCode?.split('') ?? []
                const fileUrl = fileCode?.length >= 4
                    ? `https://media-ffhb-fdm.ffhandball.fr/fdm/${fileCode[0]}/${fileCode[1]}/${fileCode[2]}/${fileCode[3]}/${rencontre.fdmCode}.pdf`
                    : null

                const referees = [
                    rencontre.arbitre1,
                    rencontre.arbitre2,
                ].filter(x => x) ?? []

                const locations = (() => {
                    const adress = details[i]
                    if (adress.status === 'fulfilled')
                        return adress.value.address
                    return /** @type {FfhbApiAddressResult} */({})
                })()

                return /** @type {import('ical-generator').ICalEventData} */({
                    location: [
                        locations.equipement?.libelle,
                        locations.equipement?.rue,
                        locations.equipement?.ville,
                    ].map(location => location?.trim()).filter(x => !!x).join(', ').toUpperCase(),
                    description: [
                        rencontre.equipe1Score && rencontre.equipe2Score
                            ? `${status} Score : ${rencontre.equipe1Score} - ${rencontre.equipe2Score}`
                            : '👉 À venir',
                        fileUrl ? `🔗 ${fileUrl.replace('https://', '')}` : null,
                        referees?.length ? `🧑‍⚖️ ${new Intl.ListFormat('fr-FR', { style: 'long', type: 'conjunction' }).format(referees)}` : null,
                    ].filter(x => x).join('\n'),
                    start: dtStart,
                    end: dtEnd,
                    summary: `J.${rencontre.journeeNumero} : ${rencontre.equipe1Libelle || '?'} vs ${rencontre.equipe2Libelle || '?'}`,
                    url,
                    attachments: fileUrl ? [fileUrl] : undefined,
                })
            }).filter(x => x)

        if (!events.length)
            return res.status(404).send(`
                <p>Aucun match n'a été trouvé : </p>
                <ul>
                    <li>
                        Veuillez vérifier que le lien fourni respecte bien <a href="/" target="_blank">les conditions</a> : 
                        <a href={${url}} target="_blank">${url}</a>
                    </li>
                    <li>Veuillez vérifier qu'au moins un des matchs ait une date/heure associée (pas uniquement une journée)</li>
                </ul>
            `)

        /** @type {FfhbApiJourneesResult} */
        const journees = JSON.parse(rencontreList.poule.journees)

        const cal = ical({
            timezone: 'Europe/Paris',
            name: `${title || rencontreList.poule.libelle} (${[
                new Date(journees?.[0]?.date_debut)?.getFullYear() || '?',
                new Date(journees?.at(-1)?.date_debut)?.getFullYear() || '?',
            ].join(' - ')})`,
            events,
        })

        return cal.serve(res)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        return res.status(500).send(error)
    }
}
