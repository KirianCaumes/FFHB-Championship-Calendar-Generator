import { mkdir, readFile, stat, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import ical from 'ical-generator'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import getCfkKey from './get-cfk-key.util.js'
import decipher from './decipher.util.js'

const ICALS_FOLDER = './icals'

/**
 * Get ics
 * @param {object} params Params
 * @param {string} params.url Url
 * @param {string} params.title Title
 * @returns {Promise<string>} ICS file
 */
export default async function getIcs({ url, title }) {
    /** Equipe Id from URL */
    const equipeId = /\/equipe-([^)]+)\//gm.exec(url)[1]

    /** Path to ICS file */
    const filePath = `${ICALS_FOLDER}/${equipeId}.ics`

    // Read from cache, if file was updated 1h ago max. That way, we can prevent spamming FFHB website
    if (existsSync(filePath) && Math.abs((await stat(filePath)).mtime.getTime() - new Date().getTime()) / 36e5 < 1) {
        /** ICS file found */
        const ics = await readFile(filePath, 'utf-8')

        if (ics) {
            return ics
        }
    }

    /** Competition Id from URL */
    const competitionId = url.replace(/\/$/, '').split('/').at(-2)

    // Get rencontre list data
    const { data: rencontreListData } = await axios.request({
        url: 'https://www.ffhandball.fr/wp-json/competitions/v1/computeBlockAttributes',
        method: 'GET',
        params: {
            block: 'competitions---rencontre-list',
            url_competition: competitionId,
            ext_equipe_id: equipeId,
        },
    })

    /** Key used to to decipher */
    const cfkKey = await getCfkKey()

    /** Deciphered rencontre list */
    const rencontreList = /** @type {FfhbApiCompetitionListResult} */ (decipher(rencontreListData, cfkKey))

    if (rencontreList.rencontres?.length === 0) {
        throw new Error(`Aucune rencontres n'a été trouvé pour l'URL ${url} `)
    }

    /** Addresses (and more?) are scraped because they are not inside the API returns. And no others API seems to be available for these data */
    const details = await Promise.allSettled(
        rencontreList.rencontres.map(async rencontre => {
            /** Base URL to be call */
            const baseUrl = url.replace(/\/$/, '').split('/').slice(0, -1).join('/')
            /** Full rencontre URL */
            const rencontreUrl = `${baseUrl}/poule-${rencontre.extPouleId ?? rencontreList.poule.ext_pouleId}/rencontre-${rencontre.ext_rencontreId}`

            // Get raw HTML data from the page
            const { data: addressData } = await axios.request({ url: rencontreUrl })
            // Convert HTML string to DOM
            const { document } = new JSDOM(addressData).window

            /**
             * Address data found ont the page
             * @type {FfhbApiAddressResult}
             */
            const address = JSON.parse(
                document.querySelector('smartfire-component[name="competitions---rencontre-salle"]').getAttribute('attributes'),
            )

            return { address }
        }),
    )

    /** Main team name */
    const teamName = (() => {
        /** All Teams list from match */
        const teams = rencontreList.rencontres
            .map(rencontre => [rencontre.equipe1Libelle, rencontre.equipe2Libelle])
            .flat()
            .filter(x => x)

        // Sort teams by occurrence and return first one
        // This will be the team of the current championship
        return teams.sort((a, b) => teams.filter(team => team === a).length - teams.filter(team => team === b).length).pop()
    })()

    /**
     * Global informations about journees (date and numero).
     * Each journees is associated to a different pouleId (because some teams have multiple poules).
     * @type {{ [x: string]: FfhbApiJourneesResult }}
     */
    const journeesCache = {
        [rencontreList.poule.ext_pouleId]: JSON.parse(rencontreList.poule.journees),
        // Check all rencontre to see if there is different poule(s)
        ...(
            await Promise.all(
                rencontreList.rencontres
                    .map(rencontre => rencontre.extPouleId)
                    // Filter to get only not default poule
                    .filter(
                        (extPouleId, index, array) => array.indexOf(extPouleId) === index && extPouleId !== rencontreList.poule.ext_pouleId,
                    )
                    .map(async extPouleId => {
                        // Get rencontre list data
                        const { data: newRencontreListData } = await axios.request({
                            url: 'https://www.ffhandball.fr/wp-json/competitions/v1/computeBlockAttributes',
                            method: 'GET',
                            params: {
                                block: 'competitions---rencontre-list',
                                url_competition: competitionId,
                                ext_poule_id: extPouleId,
                            },
                        })

                        /** Deciphered rencontre list */
                        const newRencontreList = /** @type {FfhbApiCompetitionListResult} */ (decipher(newRencontreListData, cfkKey))

                        return { [extPouleId]: /** @type {FfhbApiJourneesResult} */ (JSON.parse(newRencontreList.poule.journees)) }
                    }),
            )
        ).reduce((prev, curr) => ({ ...prev, ...curr }), {}),
    }

    /**
     * Events to be set in the calendar
     * @type {import('ical-generator').ICalEventData[]}
     */
    const events = rencontreList.rencontres
        .map((rencontre, i) => {
            /** Prefix for the summary event */
            const prefix = (() => {
                const lib = rencontre.phaseLibelle.toLowerCase()
                // Ex: '1ER TOUR DE COUPE UxxM'
                if (lib.includes(' de coupe')) {
                    return lib.split(' de coupe')?.[0] ?? rencontre.phaseLibelle
                }
                // Ex : '1/4 DE FINALES COUPE UxxM'
                if (lib.includes(' coupe ')) {
                    return lib.split(' coupe ')?.[0] ?? rencontre.phaseLibelle
                }
                return `J.${rencontre.journeeNumero}`
            })()

            /** Summary or title of the event */
            const summary = `${prefix} : ${rencontre.equipe1Libelle || '?'} vs ${rencontre.equipe2Libelle || '?'}`

            /** Journee url to be displayed in event content */
            const journeeUrl = rencontre.extPouleId
                ? `#️⃣ ${url.split('/').slice(0, -2).join('/')}/poule-${rencontre.extPouleId}/journee-${rencontre.journeeNumero}/`.replace(
                      'https://www.',
                      '',
                  )
                : null

            // If there's no date yet, we show a preview to the user that a match should occur this day
            if (!rencontre.date) {
                /** Corresponding journee to the rencontre with no date */
                const journee = journeesCache[rencontre.extPouleId]?.find(
                    jour => jour.journee_numero.toString() === rencontre.journeeNumero,
                )

                if (!journee || !journee.date_debut) {
                    return null
                }

                /** Arbitrary date set by the journee start and 8H00 */
                const dt = new Date(journee.date_debut)
                dt.setHours(8)

                return {
                    description: ["⚠️ En attente d'une date précise pour la rencontre", journeeUrl].filter(x => x).join('\n'),
                    start: dt,
                    end: dt,
                    summary: `🔄️ ${summary}`,
                    url,
                }
            }

            /** Start date of the rencontre */
            const dtStart = new Date(rencontre.date)
            /** End date of the rencontre (start + 1H30) */
            const dtEnd = new Date(dtStart.getTime() + 1.5 * 60 * 60 * 1000)

            /** Get status by the score */
            const status = (() => {
                if (!rencontre.equipe1Score || !rencontre.equipe2Score) {
                    return ''
                }
                const isTeamOne = rencontre.equipe1Libelle?.toLowerCase()?.trim() === teamName?.toLowerCase()?.trim()
                const teamOneScore = !Number.isNaN(parseInt(rencontre.equipe1Score, 10)) ? parseInt(rencontre.equipe1Score, 10) : 0
                const teamTwoScore = !Number.isNaN(parseInt(rencontre.equipe2Score, 10)) ? parseInt(rencontre.equipe2Score, 10) : 0
                if (isTeamOne ? teamOneScore > teamTwoScore : teamOneScore < teamTwoScore) {
                    return '✅'
                }
                if (!isTeamOne ? teamOneScore > teamTwoScore : teamOneScore < teamTwoScore) {
                    return '❌'
                }
                return '🟠'
            })()

            /** Splitted file code to be generated FDM URL */
            const fileCode = rencontre.fdmCode?.split('') ?? []
            /** FDM URL */
            const fileUrl =
                fileCode?.length >= 4
                    ? `https://media-ffhb-fdm.ffhandball.fr/fdm/${fileCode[0]}/${fileCode[1]}/${fileCode[2]}/${fileCode[3]}/${rencontre.fdmCode}.pdf`
                    : null

            /** The 0 or more arbitres of the journee */
            const referees = [rencontre.arbitre1, rencontre.arbitre2].filter(x => x) ?? []

            /** Location of the rencontre by the details results */
            const locations = (() => {
                const address = details[i]
                if (address.status === 'fulfilled') {
                    return address.value.address
                }
                return /** @type {FfhbApiAddressResult} */ ({})
            })()

            return {
                location: [locations.equipement?.libelle, locations.equipement?.rue, locations.equipement?.ville]
                    .map(location => location?.trim())
                    .filter(x => !!x)
                    .join(', ')
                    .toUpperCase(),
                description: [
                    rencontre.equipe1Score && rencontre.equipe2Score
                        ? `${status} Score : ${rencontre.equipe1Score} - ${rencontre.equipe2Score}`
                        : '👉 À venir',
                    fileUrl ? `🔗 ${fileUrl.replace('https://', '')}` : null,
                    referees?.length ? `🧑‍⚖️ ${new Intl.ListFormat('fr-FR', { style: 'long', type: 'conjunction' }).format(referees)}` : null,
                    journeeUrl,
                ]
                    .filter(x => x)
                    .join('\n'),
                start: dtStart,
                end: dtEnd,
                summary,
                url,
                attachments: fileUrl ? [fileUrl] : undefined,
            }
        })
        .filter(x => x)

    /**
     * Name of the calendar
     * @type {import('ical-generator').ICalCalendarData['name']}
     */
    let name = teamName || 'Équipe'

    /** First journee date debut cache */
    const firstDateDebut = journeesCache?.[Object.keys(journeesCache)[0]]?.[0]?.date_debut
    /** Last journee date debut cache */
    const lastDateDebut = journeesCache?.[Object.keys(journeesCache).at(-1)]?.at(-1)?.date_debut

    // Add years if possible to the calendar name
    if (firstDateDebut || lastDateDebut) {
        name += ` (${[new Date(firstDateDebut)?.getFullYear(), new Date(lastDateDebut)?.getFullYear()]
            .filter((value, index, self) => value && self.indexOf(value) === index)
            .join(' - ')})`
    }

    /** Calendar object */
    const cal = ical({
        timezone: 'Europe/Paris',
        name: title || name,
        events,
    })

    // Create cache folder if does not exists yet
    if (!existsSync(ICALS_FOLDER)) {
        await mkdir(ICALS_FOLDER)
    }

    // Save to cache
    await writeFile(filePath, ical({ timezone: 'Europe/Paris', name, events }).toString())

    return cal.toString()
}
