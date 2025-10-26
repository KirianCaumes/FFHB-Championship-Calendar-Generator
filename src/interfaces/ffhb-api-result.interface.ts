export interface FfhbApiCompetitionListResult {
    /** Ext_saison_id */
    ext_saison_id?: string
    /** Url_competition_type */
    url_competition_type?: string
    /** Url_structure */
    url_structure?: string
    /** Url_competition */
    url_competition?: string
    /** Ext_poule_id */
    ext_poule_id?: string | undefined
    /** Numero_journee */
    numero_journee?: string
    /** Ext_equipe_id */
    ext_equipe_id?: string
    /** Ext_rencontre_id */
    ext_rencontre_id?: string
    /** Poule */
    poule?: {
        /** Id */
        id?: string
        /** Ext_pouleId */
        ext_pouleId?: string
        /** PhaseId */
        phaseId?: string
        /** Libelle */
        libelle?: string
        /** Journees */
        journees?: string
        /** DateDernierUpdateEnfants */
        dateDernierUpdateEnfants?: string
        /** Ext_equipeId */
        ext_equipeId?: string
        /** PouleId */
        pouleId?: string
        /** StructureId */
        structureId?: string
        /** LogoActif */
        logoActif?: string
    }
    /** Selected_numero_journee */
    selected_numero_journee?: string
    /** Rencontres */
    rencontres?: Array<{
        /** Id */
        id?: string
        /** Ext_rencontreId */
        ext_rencontreId?: string
        /** PouleId */
        pouleId?: string
        /** Equipe1Id */
        equipe1Id?: string
        /** Equipe2Id */
        equipe2Id?: string
        /** Equipe1Score */
        equipe1Score?: string
        /** Equipe2Score */
        equipe2Score?: string
        /** Equipe1ScoreMT */
        equipe1ScoreMT?: string
        /** Equipe2ScoreMT */
        equipe2ScoreMT?: string
        /** Date */
        date?: string
        /** FdmCode */
        fdmCode?: string
        /** EquipementId */
        equipementId?: string
        /** Arbitre1 */
        arbitre1?: string
        /** Arbitre1Id */
        arbitre1Id?: string
        /** Arbitre2 */
        arbitre2?: string
        /** Arbitre2Id */
        arbitre2Id?: string
        /** DateDernierUpdateEnfants */
        dateDernierUpdateEnfants?: string
        /** JourneeNumero */
        journeeNumero?: string
        /** Equipe1Libelle */
        equipe1Libelle?: string
        /** Equipe2Libelle */
        equipe2Libelle?: string
        /** Equipe1ShowLogo */
        equipe1ShowLogo?: string
        /** Equipe2ShowLogo */
        equipe2ShowLogo?: string
        /** Structure1Logo */
        structure1Logo?: string
        /** Structure2Logo */
        structure2Logo?: string
        /** PhaseLibelle */
        phaseLibelle?: string
        /** ExtPouleId */
        extPouleId?: string
    }>
}

export interface FfhbApiAddressResult {
    /** Equipement */
    equipement?: {
        /** Id */
        id?: string
        /** Ext_equipementId */
        ext_equipementId?: string
        /** Libelle */
        libelle?: string
        /** Rue */
        rue?: string
        /** CodePostal */
        codePostal?: string
        /** Ville */
        ville?: string
        /** Latitude */
        latitude?: string
        /** Longitude */
        longitude?: string
    }
    /** MapsApiKey */
    mapsApiKey?: string
}

export interface FfhbApiJourneesResult {
    /** Journee_numero */
    journee_numero?: number
    /** Date_debut */
    date_debut?: string
    /** Date_fin */
    date_fin?: string
}
