/**
 * Enum of the different sections of the house overview page.
 */
export enum IHouseOverviewSectionsEnum {
    /**
     * Equipments (par default).
     */
    EQUIPMENTS = 'équipements',
    /**
     * Accomodation.
     */
    ACCOMODATION = 'accomodation',
    /**
     * Installation.
     */
    INSTALLATION = 'installation',
}

/**
 * Type of the location state object for the house overview page.
 */
export interface HyHousePageLocationState {
    /**
     * Boolean indicating if we should focus on the installation form.
     */
    defaultSelectedSection?: IHouseOverviewSectionsEnum
}
