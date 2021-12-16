/**
 * @typedef {object} FfhbApiResult
 * @property {number} journee journee
 * @property {object[]} teams teams
 * @property {number} teams.position position
 * @property {string} teams.name name
 * @property {number} teams.points points
 * @property {number} teams.games games
 * @property {number} teams.wins wins
 * @property {number} teams.draws draws
 * @property {number} teams.defeats defeats
 * @property {number} teams.scored scored
 * @property {number} teams.missed missed
 * @property {number} teams.difference difference
 * @property {object[]} players players
 * @property {number} players.index index
 * @property {string} players.playerId playerId
 * @property {string} players.firstName firstName
 * @property {string} players.lastName lastName
 * @property {string} players.club club
 * @property {number} players.clubId clubId
 * @property {string[] | number[]} players.statistics statistics
 * @property {{[key: number]: FfhbApiDatesResult}} dates dates
 */

/**
 * @typedef {object} FfhbApiDatesResult
 * @property {string} start start
 * @property {string} finish finish
 * @property {object[]} events events
 * @property {object} events.date date
 * @property {number} events.date.day day
 * @property {string} events.date.date date
 * @property {string} events.date.hour hour
 * @property {string} events.date.minute minute
 * @property {object[]} events.teams teams
 * @property {string} events.teams.name name
 * @property {string} events.teams.score score
 * @property {object[]} events.referees referees
 * @property {string|null} events.referees.name name
 * @property {string[]} events.location location
 * @property {string} events.CON_CODE_RENC CON_CODE_RENC
 * @property {null} events.pdfPath pdfPath
 */
