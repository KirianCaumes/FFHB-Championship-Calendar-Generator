import ical from 'ical-generator'
import axios from 'axios'
import Handlebars from 'handlebars'
import fs from 'fs'

/**
 * @param {import('express').Request<{}, any, any, QueryType, Record<string, any>>} req Request
 * @param {import('express').Response<any, Record<string, any>, number>} res Result
 * @returns {Promise<any>} Returns
 */
export default async function getIcs(req, res) {
    const { url, name, title } = req.query

    if (!url || !name)
        return res.send(Handlebars.compile(fs.readFileSync('./src/templates/index.template.html').toString())())

    try {
        const poolId = new URL(url)?.hash?.split('-')?.[1]

        /** @type {import('axios').AxiosResponse<FfhbApiResult>} */
        const ffhb = await axios.get(`https://jjht57whqb.execute-api.us-west-2.amazonaws.com/prod/pool/${poolId}`)

        /** @type {FfhbApiDatesResult[]} */
        const dates = Object.keys(ffhb.data.dates)
            .map(key => ffhb.data.dates[key])

        const events = dates
            .map(date => date.events)
            .flat()
            .filter(event => event.teams.some(team => team.name?.toLowerCase()?.trim() === name?.toLowerCase()?.trim())
                && event.date.date && event.date.hour && event.date.minute)
            .map(event => {
                const [teamOne, teamTwo] = event.teams
                const {
                    date, hour, minute, day,
                } = event.date
                const dtStart = new Date(`${date}T${hour}:${minute}:00`)
                const dtEnd = new Date(dtStart.getTime() + (1.5 * 60 * 60 * 1000))
                const status = (() => {
                    if (!teamOne?.score || !teamOne?.score)
                        return ''
                    const isTeamOne = teamOne.name?.toLowerCase()?.trim() === name?.toLowerCase()?.trim()
                    const teamOneScore = !Number.isNaN(parseInt(teamOne?.score, 10)) ? (parseInt(teamOne?.score, 10)) : 0
                    const teamTwoScore = !Number.isNaN(parseInt(teamTwo?.score, 10)) ? (parseInt(teamTwo?.score, 10)) : 0
                    if (isTeamOne ? teamOneScore > teamTwoScore : teamOneScore < teamTwoScore)
                        return '✅'
                    if (!isTeamOne ? teamOneScore > teamTwoScore : teamOneScore < teamTwoScore)
                        return '❌'
                    return '🟠'
                })()

                return {
                    location: event.location.map(location => location?.trim()).filter(x => !!x).join(', ').toUpperCase(),
                    description: teamOne?.score && teamTwo?.score ? `Score : ${teamOne?.score} - ${teamTwo?.score} ${status}` : 'À venir',
                    start: dtStart,
                    end: dtEnd,
                    summary: `J.${day} : ${teamOne?.name || '?'} vs ${teamTwo?.name || '?'}`,
                    url,
                }
            })

        if (!events.length)
            return res.status(404).send("Aucun match n'a été trouvé correspondant à votre équipe.")

        const cal = ical({
            timezone: 'Europe/Paris',
            name: `${title || name} (${dates[0].start?.split('-')?.[0] || '?'} - ${dates.at(-1).start?.split('-')?.[0] || '?'})`,
            events,
        })

        return cal.serve(res)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        return res.status(500).send(error)
    }
}
