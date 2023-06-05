/**
 * @typedef {object} FfhbApiCompetitionListResult
 * @property {string} ext_saison_id ext_saison_id
 * @property {string} url_competition_type url_competition_type
 * @property {string} url_structure url_structure
 * @property {string} url_competition url_competition
 * @property {string|undefined} ext_poule_id ext_poule_id
 * @property {string} numero_journee numero_journee
 * @property {string} ext_equipe_id ext_equipe_id
 * @property {string} ext_rencontre_id ext_rencontre_id
 * @property {object} poule poule
 * @property {string} poule.id id
 * @property {string} poule.ext_pouleId ext_pouleId
 * @property {string} poule.phaseId phaseId
 * @property {string} poule.libelle libelle
 * @property {string} poule.journees journees
 * @property {string} poule.dateDernierUpdateEnfants dateDernierUpdateEnfants
 * @property {string} poule.ext_equipeId ext_equipeId
 * @property {string} poule.pouleId pouleId
 * @property {string} poule.structureId structureId
 * @property {string} poule.logoActif logoActif
 * @property {string} selected_numero_journee selected_numero_journee
 * @property {object[]} rencontres rencontres
 * @property {string} rencontres.id id
 * @property {string} rencontres.ext_rencontreId ext_rencontreId
 * @property {string} rencontres.pouleId pouleId
 * @property {string} rencontres.equipe1Id equipe1Id
 * @property {string} rencontres.equipe2Id equipe2Id
 * @property {string} rencontres.equipe1Score equipe1Score
 * @property {string} rencontres.equipe2Score equipe2Score
 * @property {string} rencontres.equipe1ScoreMT equipe1ScoreMT
 * @property {string} rencontres.equipe2ScoreMT equipe2ScoreMT
 * @property {string} rencontres.date date
 * @property {string} rencontres.fdmCode fdmCode
 * @property {string} rencontres.equipementId equipementId
 * @property {string} rencontres.arbitre1 arbitre1
 * @property {string} rencontres.arbitre1Id arbitre1Id
 * @property {string} rencontres.arbitre2 arbitre2
 * @property {string} rencontres.arbitre2Id arbitre2Id
 * @property {string} rencontres.dateDernierUpdateEnfants dateDernierUpdateEnfants
 * @property {string} rencontres.journeeNumero journeeNumero
 * @property {string} rencontres.equipe1Libelle equipe1Libelle
 * @property {string} rencontres.equipe2Libelle equipe2Libelle
 * @property {string} rencontres.equipe1ShowLogo equipe1ShowLogo
 * @property {string} rencontres.equipe2ShowLogo equipe2ShowLogo
 * @property {string} rencontres.structure1Logo structure1Logo
 * @property {string} rencontres.structure2Logo structure2Logo
 * @property {string} rencontres.phaseLibelle phaseLibelle
 */

/**
 * @typedef {object} FfhbApiAddressResult
 * @property {object} equipement equipement
 * @property {string} equipement.id id
 * @property {string} equipement.ext_equipementId ext_equipementId
 * @property {string} equipement.libelle libelle
 * @property {string} equipement.rue rue
 * @property {string} equipement.codePostal codePostal
 * @property {string} equipement.ville ville
 * @property {string} equipement.latitude latitude
 * @property {string} equipement.longitude longitude
 * @property {string} mapsApiKey mapsApiKey
 */

/**
 * @typedef {object[]} FfhbApiJourneesResult
 * @property {number} journee_numero journee_numero
 * @property {string} date_debut date_debut
 * @property {string} date_fin date_fin
 */
